package eu.tecfox.timefox.api.services.impl;

import eu.tecfox.timefox.api.services.Entity;
import eu.tecfox.timefox.api.services.EntityService;
import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;

public class EntityServiceImpl implements EntityService {

	@Override
	public void loadRange(JsonObject startAndEndDate, Handler<AsyncResult<Entity>> result) {
		
	}

	@Override
	public void loadRecord(JsonObject dateParam, Handler<AsyncResult<Entity>> result) {

	}

	@Override
	public void createRecord(JsonObject entity) {

	}

	@Override
	public void updateRecord(JsonObject entity) {

	}

}
