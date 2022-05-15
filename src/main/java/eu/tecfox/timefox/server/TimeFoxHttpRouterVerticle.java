package eu.tecfox.timefox.server;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.net.PemKeyCertOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;

/**
 * Die Klasse ist lediglich eine "Durchleitung" von HTTP requests und exponiert
 * einige statische Ressourcen wie z.B. JavaScript Dateien. Hauptaufgabe wird es
 * sein, das "Backend" zur Verfügung zu stellen, welches aufgrund des gewählten
 * Vertx Toolkits wohl ein "Verticle" sein wird; die Implementierungsweise
 * (Java, JavaScript, Ruby, Scala usw.) ist allerdings noch völlig offen..
 * Desweiteren kann das Toolkit dazu genutzt werden, sog. Querschnittsbelange
 * (Sicherheit, Performance usw.) abzubilden, ohne den eig. Quellcode zu ändern.
 * 
 * @author akrebs
 */
public class TimeFoxHttpRouterVerticle extends AbstractVerticle {

	@Override
	public void start(Promise<Void> startPromise) throws Exception {
		Router router = Router.router(vertx);
		createHandlers(router);
		vertx.createHttpServer(readConfig(false)).requestHandler(router).listen(8080);
	}

	private HttpServerOptions readConfig(boolean useSsl) {
		return useSsl ? createSslOptions() : createHttpOptions();
	}

	private HttpServerOptions createHttpOptions() {
		return new HttpServerOptions();
	}

	private HttpServerOptions createSslOptions() {
		return new HttpServerOptions().setSsl(true).setUseAlpn(true).setPemKeyCertOptions(
				new PemKeyCertOptions().setKeyPath("tls/server-key.pem").setCertPath("tls/server-cert.pem"));
	}

	private void createHandlers(Router router) {
		createRootContextHandler(router);
		createStaticRoutes(router);
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

}
