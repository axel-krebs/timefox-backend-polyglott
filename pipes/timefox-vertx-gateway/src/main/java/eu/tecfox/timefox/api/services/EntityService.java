package eu.tecfox.timefox.api.services;

import io.vertx.codegen.annotations.ProxyGen;
import io.vertx.codegen.annotations.VertxGen;
import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;

@VertxGen
@ProxyGen
public interface EntityService {

	/**
	 * Address used by provider and consumer.
	 */
	static final String VERTX_EVENTBUS_ADDRESS = "timefox.entity-service";

	/**
	 * This method loads an array of TimeRecord objects in the given range.
	 * 
	 * @param startDate
	 * @param endDate
	 * @return Entity containing a range of TimeRecord objects.
	 */
	void loadRange(JsonObject startAndEndDate, Handler<AsyncResult<Entity>> result);

	/**
	 * This method looks for exactly 1 record.
	 * 
	 * @param data
	 * @return Entity containing exactly 1 record.
	 */
	void loadRecord(JsonObject dateParam, Handler<AsyncResult<Entity>> result);

	/**
	 * Create an entity containing 0 - n TimeRecords.
	 * 
	 * @param entity S. definition in Java file: @DataObject
	 * @return
	 */
	void createRecord(JsonObject entity);

	/**
	 * Update an entity inclusive TimeRecords.
	 * 
	 * @param entity
	 * @return
	 */
	void updateRecord(JsonObject entity);

	/**
	 * Vertx method. EntityServiceVertxEBProxy generated source by @ProxyGen, must
	 * run first.
	 * 
	 * @param vertx
	 * @param address
	 * @return EntityServiceVertxEBProxy
	 */
	static EntityService createProxy(Vertx vertx, String address) { // (5)
		return new EntityServiceVertxEBProxy(vertx, address);
	}
}
