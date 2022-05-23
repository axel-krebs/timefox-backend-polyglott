package eu.tecfox.timefox.api.services;

import java.time.ZonedDateTime;

/**
 * Used by Vertx.
 * 
 * @author akrebs
 *
 */
public class Mappers {

	public static String serialize(ZonedDateTime date) {
		return date.toString();
	}

	public static ZonedDateTime deserialize(String s) {
		return ZonedDateTime.parse(s);
	}
}
