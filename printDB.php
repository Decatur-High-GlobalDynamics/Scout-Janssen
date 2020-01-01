 
		<?php
			header("Access-Control-Allow-Origin: *");
			$password = getenv("DBPASS");
			$database = new mysqli("localhost", "pi", $password, "scout_janssen");
			if ($database->connect_error) {
				die("Connection to database failed" . $conn->connect_error);
			}
			if ($_GET["table"] === "reports" || $_GET["table"] === "matches" || $_GET["table"] === "eventteams" || $_GET["table"] == "teams") {
				$query = "SELECT * FROM " . $_GET["table"] . ";";
				$result = $database->query($query);
				$result = $result->fetch_all(MYSQLI_ASSOC);
				echo(json_encode($result));
			}
		?>