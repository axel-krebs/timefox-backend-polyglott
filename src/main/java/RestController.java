import javax.websocket.server.PathParam;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RestController {

	
	@GetMapping
	void loadRange(@PathParam("startDate") String fromDate, @PathParam("endDate")  String toDate) {
		
	}
}
