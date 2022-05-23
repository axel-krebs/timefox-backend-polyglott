package eu.tecfox.timefox.api.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.openapi.OpenAPILoaderOptions;
import io.vertx.ext.web.openapi.RouterBuilder;
import io.vertx.serviceproxy.ServiceBinder;

/**
 * Das "API-Gateway"; enthält keine 'main' Methode, ergo muss es von einem
 * Installationsskript 'deployt' werden. Die 'Services' werden in diesem Fall
 * direkt im Vertx 'event-bus' registriert; eine 'distributed' Lösung wäre auch
 * möglich, s. Vertx docs.
 * 
 * @author akrebs
 *
 */
public class TimeFoxApiGatewayVerticle extends AbstractVerticle {

	private static final Logger LOG = LoggerFactory.getLogger(TimeFoxApiGatewayVerticle.class);

	/* The OpenApi YAML file; must be on classpath */
	private static final String CLIENT_API_YAML_FILE = "api/v1.0/client-na.yaml";

	HttpServer server;
	ServiceBinder serviceBinder;

	@Override
	public void start() throws Exception {
		deployServices(this.vertx);
		startHttpServing(this.vertx);
	}

	private void deployServices(Vertx vx) {
		
	}

	private Future<Void> startHttpServing(Vertx vx) {
		OpenAPILoaderOptions loadOpts = new OpenAPILoaderOptions();
		return RouterBuilder.create(vx, CLIENT_API_YAML_FILE, loadOpts).onFailure(Throwable::printStackTrace)
				.compose(routerBuilder -> {

					// Mounting services on event bus based on extensions would imply to add the
					// 'x-vertx-event-bus' annotation to the YAML file, which is not wanted now. 
					// routerBuilder.mountServicesFromExtensions();

					// Generate the router
					Router router = routerBuilder.createRouter();
					
					
					
					router.errorHandler(400, ctx -> {
						LOG.debug("Bad Request", ctx.failure());
					});
					server = vertx.createHttpServer(new HttpServerOptions().setPort(8080).setHost("localhost"))
							.requestHandler(router);
					return server.listen().mapEmpty();
				});
	}

	@Override
	public void stop() throws Exception {

	}

}
