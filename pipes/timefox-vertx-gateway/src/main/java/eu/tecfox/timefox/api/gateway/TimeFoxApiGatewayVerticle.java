package eu.tecfox.timefox.api.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import eu.tecfox.timefox.api.services.Entity;
import eu.tecfox.timefox.api.services.EntityService;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.openapi.OpenAPILoaderOptions;
import io.vertx.ext.web.openapi.RouterBuilder;

/**
 * Das 'Gateway'-Verticle;
 * 
 * @author akrebs
 *
 */
public class TimeFoxApiGatewayVerticle extends AbstractVerticle {

	private static final Logger LOG = LoggerFactory.getLogger(TimeFoxApiGatewayVerticle.class);

	/* The OpenApi YAML file; must be on classpath! */
	private static final String CLIENT_API_YAML_FILE = "client-na.yaml";

	private EntityService entityService;

	HttpServer server;

	@Override
	public void start() throws Exception {
		entityService = EntityService.createProxy(this.vertx, EntityService.VERTX_EVENTBUS_ADDRESS);
		startHttpServing(this.vertx);
	}

	private Future<Void> startHttpServing(final Vertx vtx) {
		OpenAPILoaderOptions loadOpts = new OpenAPILoaderOptions();
		return RouterBuilder.create(vtx, CLIENT_API_YAML_FILE, loadOpts).onFailure(Throwable::printStackTrace)
				.compose(routerBuilder -> {

					// Mounting services on the eventbus based on extensions would imply to add the
					// 'x-vertx-event-bus' annotation to the YAML file, which is not wanted here.
					// routerBuilder.mountServicesFromExtensions();
					// Instead, define the routes programmatically:

					Router router = routerBuilder.createRouter();
					
					router.get("/").handler(ctx -> {
						ctx.end("{\"message\": \"You called the root context!\"}");
					});

					router.get("/loadRange/{startDate}/{endDate}").handler(ctx -> {
						JsonObject params = new JsonObject();
						Object startDate = ctx.request().getParam("startDate");
						Object endDate = ctx.request().getParam("endDate");

						params.put("startDate", startDate);
						params.put("endDate", endDate);

						entityService.loadRange(params, handler -> {
							Entity res = handler.result();
							writeEntityResponse(ctx, res);
						});
					});

					router.errorHandler(400, ctx -> {
						LOG.debug("Bad Request", ctx.failure());
					});
					server = vertx.createHttpServer(new HttpServerOptions())
							.requestHandler(router);
					return server.listen(8080).mapEmpty();
				});
	}

	// Uh, this is still not async.. ?
	private void writeEntityResponse(RoutingContext ctx, Entity res) {
		ctx.addHeadersEndHandler(heh -> {
			ctx.response().setStatusCode(200);
			ctx.response().headers().add("Content-Type", "application/json");
		});
		ctx.addBodyEndHandler(beh -> {
			res.toJson().toString();
		});
		ctx.next();
	}

	@Override
	public void stop() throws Exception {

	}

}
