package eu.tecfox.timefox.api.services;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.impl.JsonUtil;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

/**
 * Converter and mapper for {@link eu.tecfox.timefox.api.services.Entity}.
 * NOTE: This class has been automatically generated from the {@link eu.tecfox.timefox.api.services.Entity} original class using Vert.x codegen.
 */
public class EntityConverter {


  private static final Base64.Decoder BASE64_DECODER = JsonUtil.BASE64_DECODER;
  private static final Base64.Encoder BASE64_ENCODER = JsonUtil.BASE64_ENCODER;

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, Entity obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
      }
    }
  }

  public static void toJson(Entity obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(Entity obj, java.util.Map<String, Object> json) {
  }
}
