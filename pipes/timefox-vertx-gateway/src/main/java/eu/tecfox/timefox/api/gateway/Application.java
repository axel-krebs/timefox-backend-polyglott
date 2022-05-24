package eu.tecfox.timefox.api.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.vertx.core.Vertx;

public class Application {
	
	private static final Logger LOG = LoggerFactory.getLogger(Application.class);

	public static void main(String[] args) {
		 Vertx vertx = Vertx.vertx();
		 
		 LOG.info("Starting verticles..");
		 
		 vertx.deployVerticle(new EntityServiceProviderVerticle(), ar -> {
			 LOG.info(".. EntityServiceProviderVerticle has been deployed!");
		 });
		 vertx.deployVerticle(new TimeFoxApiGatewayVerticle(), ar -> {
			 LOG.info(".. TimeFoxApiGatewayVerticle has been deployed!");
		 });
		 
		 LOG.info("Starting other services..");
		 // TODO: Start monitor etc.
	}
}
