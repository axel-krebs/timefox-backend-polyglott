package eu.tecfox.timefox.api.gateway;

import eu.tecfox.timefox.api.services.EntityService;
import eu.tecfox.timefox.api.services.impl.EntityServiceImpl;
import io.vertx.core.AbstractVerticle;
import io.vertx.serviceproxy.ServiceBinder;

/**
 * When started, this provides the EntityService on the eventbus.
 * 
 * @author akrebs
 *
 */
public class EntityServiceProviderVerticle extends AbstractVerticle {

	@Override
	public void start() throws Exception {
		EntityService esImpl = new EntityServiceImpl();
		new ServiceBinder(vertx).setAddress(EntityService.VERTX_EVENTBUS_ADDRESS).register(EntityService.class, esImpl);
	}

}
