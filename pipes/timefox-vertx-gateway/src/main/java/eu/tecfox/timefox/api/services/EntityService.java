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
	void createRecord(Entity entity);

	/**
	 * Update an entity inclusive TimeRecords.
	 * 
	 * @param entity
	 * @return
	 */
	void updateRecord(Entity entity);

	/**
	 * Vertx method. 
	 * @param vertx
	 * @param address
	 * @return
	 */
	static EntityService createProxy(Vertx vertx, String address) { // (5)
		return new EntityServiceVertxEBProxy(vertx, address);
	}
}
