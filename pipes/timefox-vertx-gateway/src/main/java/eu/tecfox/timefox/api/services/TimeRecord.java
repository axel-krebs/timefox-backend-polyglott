package eu.tecfox.timefox.api.services;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

@DataObject(generateConverter = true)
public class TimeRecord {

	Number hours;
	String issue;
	String text;

	public TimeRecord(JsonObject initParams) {
		super();
		TimeRecordConverter.fromJson(initParams, this);
	}
	
	public JsonObject toJson() {
		JsonObject retVal = new JsonObject();
		TimeRecordConverter.toJson(this, retVal);
		return retVal;
	}

	public Number getHours() {
		return hours;
	}

	public void setHours(Number hours) {
		this.hours = hours;
	}

	public String getIssue() {
		return issue;
	}

	public void setIssue(String issue) {
		this.issue = issue;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

}
