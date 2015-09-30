$(document).ready(function() {
	
	$.getJSON('sparql.php',data={'query': 'SELECT ?label WHERE { ?pizza rdfs:subClassOf pizza:NamedPizza . ?pizza rdfs:label ?label . }', 'reasoning': 0}, function(data){
	var append = ""
	for(var i = 0; i < data.rows.length; i++) {
    	var pre_append = "<li><a onclick=\"select_pizza('" + data.rows[i].label.value + "')\">" + data.rows[i].label.value + "</a></li>";
    	append += pre_append;
	}
	$("#pizza-select").html(append);
	});
})


function select_pizza(pizza) {
	
	$("#selected_pizza").html("Pizza " + pizza);
	
	$.getJSON('sparql.php',data={'query': 'SELECT ?label WHERE { ?pizza rdfs:label \'' + pizza + '\'@pt . ?pizza rdfs:subClassOf ?restriction . ?restriction owl:someValuesFrom ?topping . ?topping rdfs:label ?label}', 'reasoning': 0}, function(data){
		
		var append = "<ul>";
		for(var i = 0; i < data.rows.length; i++) {
    		var pre_append = "<li>" + data.rows[i].label.value + "</li>";
			append += pre_append;
		}
		append += "</ul><h4>Show categories pizza belongs to:</h4><a id=\"inf\" class=\"btn btn-primary\" style=\"margin-right: 20px;\">With inferencing</a><a id=\"noinf\" class=\"btn btn-primary\">Without inferencing</a><div id=\"cats\"></div>";
		$("#pizza-toppings").html(append);
		
		$("#inf").on("click", function() {
			inf(pizza, 1);
		});
		
		$("#noinf").on("click", function() {
			inf(pizza, 0);
		})
	});
}

function inf(pizza, inf) {
	$.getJSON('sparql.php',data={'query': 'SELECT ?label WHERE { ?pizza rdfs:label \'' + pizza + '\'@pt . ?pizza rdfs:subClassOf ?cat . ?cat rdfs:subClassOf pizza:Pizza . ?cat rdfs:label ?label . }', 'reasoning': inf}, function(data){
		var append = "<ul style=\"margin-top: 20px;\">";
		for(var i = 0; i < data.rows.length; i++) {
			var wrong = ["Pizza", "PizzaComUmNome", pizza];
			if($.inArray(data.rows[i].label.value, wrong) == -1) {
    			var pre_append = "<li>" + data.rows[i].label.value + "</li>";
				append += pre_append;
			}
		}
		append += "</ul>";
		if(append.indexOf("<li>") >= 0) {
			$("#cats").html(append);
		} else {
			$("#cats").html("<p style=\"margin-top: 20px;\">Helaas zijn er geen resultaten gevonden..</p>");
		}
	});
}
