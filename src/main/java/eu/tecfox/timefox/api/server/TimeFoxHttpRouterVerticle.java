package eu.tecfox.timefox.api.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.yaml.snakeyaml.Yaml;

import io.vertx.config.ConfigChange;
import io.vertx.config.ConfigRetriever;
import io.vertx.config.ConfigRetrieverOptions;
import io.vertx.config.ConfigStoreOptions;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Handler;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.json.JsonObject;
import io.vertx.core.net.PemKeyCertOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.proxy.handler.ProxyHandler;
import io.vertx.httpproxy.HttpProxy;

/**
 * Die Klasse ist lediglich eine "Durchleitung" von HTTP requests und exponiert
 * einige statische Ressourcen wie z.B. JavaScript Dateien usw.. Hauptaufgabe
 * wird es aber sein, das "Backend" zur Verfügung zu stellen, d.i. in diesem
 * Fall ein "API-Gateway", das aufgrund des gewählten Vertx Toolkits wohl ein
 * "Verticle" sein wird. Desweiteren kann das Toolkit dazu genutzt werden, sog.
 * Querschnittsbelange (Sicherheit, Performance usw.) abzubilden, ohne den eig.
 * Quellcode zu ändern.
 * 
 * @author akrebs
 */
public class TimeFoxHttpRouterVerticle extends AbstractVerticle {

	private static final Logger LOG = LoggerFactory.getLogger(TimeFoxHttpRouterVerticle.class);

	private ConfigRetrieverOptions configOptions = new ConfigRetrieverOptions();

	private ConfigStoreOptions configFileStore = new ConfigStoreOptions();

	{
		// config file must be on classpath
		configFileStore.setType("file").setConfig(new Yaml().load("timefox-vertx.yaml"));
		configOptions.addStore(configFileStore);
	}

	protected static final String ROUTER_PORT_KEY = "timefox.endpoints.router.http";

	private static final String GATEWAY_PORT_KEY = "timefox.endpoints.apigateway.http";

	private static final String GATEWAY_HOST_KEY = "timefox.endpoints.apigateway.host";

	@Override
	public void start(Promise<Void> startPromise) throws Exception {
		startPromise.future().onComplete(ar -> {
			if (ar.succeeded()) {
				ConfigRetriever config = ConfigRetriever.create(vertx, configOptions);

				// start listening as soon as we know on which port..
				config.listen(new Handler<ConfigChange>() {

					@Override
					public void handle(ConfigChange event) {
						JsonObject jsonConfig = event.getNewConfiguration();
						Router router = Router.router(vertx);
						createHandlers(router, jsonConfig);
						Integer httpPort = jsonConfig.getInteger(ROUTER_PORT_KEY);
						HttpServerOptions httpOpts = createDefaultConfig(true); // TODO: https
						httpOpts.setPort(httpPort);
						vertx.createHttpServer(httpOpts).requestHandler(router).listen();
						LOG.info("Router created.");
					}
				});
			} else {
				LOG.warn("Somthing went wrong creating the router.");
			}
		});
	}

	private HttpServerOptions createDefaultConfig(boolean useSsl) {
		return useSsl ? createSslOptions() : createHttpOptions();
	}

	private HttpServerOptions createHttpOptions() {
		return new HttpServerOptions();
	}

	private HttpServerOptions createSslOptions() {
		return new HttpServerOptions().setSsl(true).setUseAlpn(true).setPemKeyCertOptions(
				new PemKeyCertOptions().setKeyPath("tls/server-key.pem").setCertPath("tls/server-cert.pem"));
	}

	private void createHandlers(Router router, JsonObject jsonConfig) {
		createRootContextHandler(router);
		createStaticRoutes(router);
		createApiGatewayRoute(router, jsonConfig);
	}

	/*
	 * When the root context is invoked, return a Hello message; this could be used
	 * otherwise, e.g. evaluate headers and SSO.. Idea: 'echo' the client request!
	 */
	private void createRootContextHandler(Router router) {
		router.get("/").handler(ctx -> {
			ctx.response().putHeader("Content-Type", "text/json").end("{message: \"Hello\"}");
		});
	}

	/*
	 * Deliver the HTML/JavaScript.
	 */
	private void createStaticRoutes(Router router) {
		router.get("/app*").handler(ctx -> {
			if (ctx.request().path().equals("/")) {
				ctx.response().sendFile("jsapp/index.html");
			} else {
				ctx.response().sendFile("jsapp" + ctx.request().path());
			}
		});
	}

	/*
	 * Using a simple ProxyHandler here; alternatively, we could proxy to the
	 * build-in eventbus; Advanced deployment would use ServiceMesh or Consul et al.
	 */
	private void createApiGatewayRoute(Router router, JsonObject jsonObject) {
		Integer gwPort = jsonObject.getInteger(GATEWAY_PORT_KEY);
		String gwHostName = jsonObject.getString(GATEWAY_HOST_KEY);
		router.route("/api/{version}/*").handler(ProxyHandler.create(

				// Evaluate API version -?
				HttpProxy.reverseProxy(vertx.createHttpClient())
						// to the dummy backend
						.origin(gwPort, gwHostName)));
	}
}
