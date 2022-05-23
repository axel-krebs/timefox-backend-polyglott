package eu.tecfox.timefox.app.router;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.netty.handler.codec.http.HttpResponseStatus;
import io.vertx.config.ConfigRetriever;
import io.vertx.config.ConfigRetrieverOptions;
import io.vertx.config.ConfigStoreOptions;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.json.JsonObject;
import io.vertx.core.net.PemKeyCertOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.proxy.handler.ProxyHandler;
import io.vertx.httpproxy.HttpProxy;

/**
 * Die Klasse ist lediglich eine "Durchleitung" von HTTP requests und exponiert
 * einige statische Ressourcen wie z.B. JavaScript Dateien usw.. Hauptaufgabe
 * wird es aber sein, das "Backend" zur Verfügung zu stellen. Desweiteren kann
 * das Toolkit dazu genutzt werden, sog. Querschnittsbelange (Sicherheit,
 * Performance usw.) abzubilden, ohne den eig. Quellcode zu ändern.
 * 
 * @author akrebs
 */
public class TimeFoxHttpRouterVerticle extends AbstractVerticle {

	private static final Logger LOG = LoggerFactory.getLogger(TimeFoxHttpRouterVerticle.class);

	private static final String YAML_FILE = "router-vertx.yaml";

	private static final String HTTP_PORT_KEY = "http";

	private static final String HTTP_HOST_KEY = "host";

	private static final String ROUTE_PATTERN_KEY = "route";

	private ConfigStoreOptions configFileStore = new ConfigStoreOptions().setType("file").setFormat("yaml")
			.setConfig(new JsonObject().put("path", YAML_FILE));

	private ConfigRetrieverOptions configRetrieverOptions = new ConfigRetrieverOptions().addStore(configFileStore);

	@Override
	public void start() throws Exception {

		LOG.info("Starting TimeFoxHttpRouterVerticle..");

		// config file must be on classpath
		ConfigRetriever configRetriever = ConfigRetriever.create(vertx, configRetrieverOptions);

		// start listening as soon as we know on which port..
		configRetriever.getConfig(configFuture -> {
			if (configFuture.succeeded()) {
				JsonObject jsonConfig = configFuture.result();
				Router router = Router.router(vertx);
				JsonObject tfConfig = jsonConfig.getJsonObject("server");

				createHandlers(router, tfConfig);

				// check config??
				JsonObject routerConf = tfConfig.getJsonObject("router");
				Integer httpPort = routerConf.getInteger(HTTP_PORT_KEY);
				HttpServerOptions httpOpts = createDefaultConfig(false);
				setHttpOptions(httpOpts, routerConf);

				vertx.createHttpServer(httpOpts).requestHandler(router).listen(httpPort);
			} else {
				LOG.warn("Could not create JSON config from YAML file - is 'timefox-vertx.yaml' on classpath?");
			}
		});

		LOG.info("TimeFoxHttpRouterVerticle started!");

	}

	private void setHttpOptions(HttpServerOptions httpOpts, JsonObject routerConf) {
		httpOpts.setAcceptBacklog(routerConf.getInteger("accept-backlog", 0));
		// usw.
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

	private void createHandlers(Router router, JsonObject tfConfig) {
		createRootContextHandler(router);
		createStaticRoutes(router);
		JsonObject tfGatewayConf = tfConfig.getJsonObject("gateway");
		if (null != tfGatewayConf) {
			createApiGatewayRoute(router, tfGatewayConf);
		}
	}

	/*
	 * When the root context is invoked, return a Hello message; this could be used
	 * otherwise, e.g. evaluate headers and SSO.. Idea: 'echo' the client request!
	 */
	private void createRootContextHandler(Router router) {
		router.get("/").handler(ctx -> {
			ctx.response().putHeader("Content-Type", "text/json")
					.end("{message: \"Hello, you've called the root context.\"}");
		});

		// handle illegal requests
		router.post().handler(ctx -> {
			ctx.response().putHeader("HTTP-Status", HttpResponseStatus.BAD_REQUEST.reasonPhrase());
		});
	}

	/*
	 * Deliver the HTML/JavaScript.
	 */
	private void createStaticRoutes(Router router) {

		router.route("/app/*").handler(ctx -> {

			// respect root context..
			if (ctx.request().path().equals("/app/")) {
				ctx.response().sendFile("jsapp/index.html");
			} else {

				// ..everything after the 4th character must be request for static content!
				String path = ctx.request().path();
				String reqContent = path.substring(4, path.length());
				ctx.response().sendFile("jsapp" + reqContent);
			}
		});
	}

	/*
	 * Using a simple ProxyHandler here; alternatively, we could proxy to the
	 * build-in eventbus; Advanced deployment would use ServiceMesh or Consul et al.
	 */
	private void createApiGatewayRoute(Router router, JsonObject gwConfig) {
		Integer gwPort = gwConfig.getInteger(HTTP_PORT_KEY);
		String gwHostName = gwConfig.getString(HTTP_HOST_KEY);
		String gwRoute = gwConfig.getString(ROUTE_PATTERN_KEY);

		// check config ??
		router.route(gwRoute).handler(ProxyHandler.create(

				// Evaluate API version -?
				HttpProxy.reverseProxy(vertx.createHttpClient())

						// to the api gateway
						.origin(gwPort, gwHostName)));
	}
}
