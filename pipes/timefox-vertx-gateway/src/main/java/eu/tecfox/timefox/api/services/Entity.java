package eu.tecfox.timefox.api.services;

import java.time.ZonedDateTime;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

@DataObject(generateConverter = true)
public class Entity {

	ZonedDateTime date;
	TimeRecord[] timeRecords;

	public Entity(JsonObject initParams) {
		super();
		EntityConverter.fromJson(initParams, this);
	}
	
	public JsonObject toJson() {
		JsonObject json = new JsonObject();
		EntityConverter.toJson(this,json);
		return json;
	}

	public ZonedDateTime getDate() {
		return date;
	}

	public void setDate(ZonedDateTime date) {
		this.date = date;
	}

//	public TimeRecord[] getTimeRecords() {
//		return timeRecords;
//	}

//	public void setTimeRecords(TimeRecord[] timeRecords) {
//		this.timeRecords = timeRecords;
//	}

}
