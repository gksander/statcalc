statcalc.distributions["cpf-poisson"] = {
	render: function(){
		return `
			<h1 class='pretty'>Poisson Distribution</h1>

			<table class='input-table' align='center'>
				<tr>
					<td> Expected Number of \"Events\" Given size/duration ($\\lambda$) </td>
					<td> <input type='text' id='cpf-poisson-n' placeholder='n' value='1.5'/> </td>
				</tr>
				<tr>
					<td> Lower Limit </td>
					<td> <input type='text' id='cpf-poisson-l' placeholder='Lower Limit' value='1'/> </td>
				</tr>
				<tr>
					<td> Upper Limit (Max Num. of Successes) </td>
					<td> <input type='text' id='cpf-poisson-u' placeholder='Upper Limit' value='4'/> </td>
				</tr>
				<tr>
					<td colspan='2' class='text-center'>
						<button type='button' id='cpf-poisson-compute' class='compute'>Compute Probability</button>
					</td>
				</tr>
			</table>

			<h4>The Cumulative Probability of [Upper Limit] or fewer occurances:</h4>
			<div id='cpf-poisson-calculation' class='calculation'></div>

			<div id='cpf-poisson-board' class='board'></div>
		`;
	},

	register: function(){

		$("#cpf-poisson-compute").on("click", function(){
			try {

				var a = math.eval($("#cpf-poisson-l").val()),
			        b = math.eval($("#cpf-poisson-u").val()),
			        n = math.eval($("#cpf-poisson-n").val());
			    // Do a little validation
			    if (a < 0 || b < 0 || b < a){
			    	throw "Improper bounds";
			    }

			    // Compute some values
			    var cdf_a = jStat.poisson.cdf(a, n),
        			cdf_b = jStat.poisson.cdf(b, n),
        			cdf_diff = jStat.poisson.cdf(b, n) - jStat.poisson.cdf(a - 1, n);

        		// Generate HTML
        		var HTMLout = `
        			\\[ \\sum_{i= ${chopDecimals(a, 3)} }^{ ${chopDecimals(b, 3)} } \\frac{e^{ ${chopDecimals(n, 3)} } ${chopDecimals(n, 3)} ^{i}} {i!} = ${cdf_diff.toFixed(statcalc.decimals)} \\]
        		`;
        		$("#cpf-poisson-calculation").html(HTMLout);
		        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

		        // JSXGraph stuff
		        $("#cpf-poisson-board").css({
		          width: "450px",
		          height: "350px"
		        });
		        var board = JXG.JSXGraph.initBoard('cpf-poisson-board', {
		          boundingbox: [-b/5, 1.2, 2*n+4, -0.2],
		          axis:true,
		          showNavigation: false,
		          showCopyright: false
		        })
		        board.create("functiongraph", [
		          function(x) {return jStat.poisson.cdf(x, n);}
		          , 0
		        ], statcalc.jsxg.properties.functiongraph);

		        // Points with labels
		        board.create("point", [a, jStat.poisson.cdf(a, n)], statcalc.jsxg.properties.point)
		        board.create("text", [
		          a,
		          jStat.poisson.cdf(a, n),
		          "(" + a + ", <i>C<sub>Poi</sub></i>(" + a + "|" + n + "))"
		        ], {
		          fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16
		        })
		        board.create("point", [b, jStat.poisson.cdf(b, n)], statcalc.jsxg.properties.point)
		        board.create("text", [
		          b,
		          jStat.poisson.cdf(b, n),
		          "(" + b + ", <i>C<sub>Poi</sub></i>(" + b + "|" + n + "))"
		        ], {
		          fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16
		        });

			} catch(err){
				$("#cpf-poisson-calculation").html(`
					<p class="red">Invalid Input</p>
				`);
			}
		});

	},

	description: {
		title: "Poisson Distribution",
		body: `
    	A Poisson situation is closely related to a binomial situation and is useful in biology. Recall that for binomial situations, we typically imagine repeating a sequence of <i>n</i> trials. We fix the value of <i>n</i> and assume that this value is \"small-ish\" and does not change.  Suppose that we imagine that the number of trials is unbounded (i.e. each sequence contains an unlimited number of trials). This is the first step in imagining of Poisson situation. Poisson situations often occur when we are studying a phenomenon where we are \"waiting\" for the occurrence of some event.  Here \"waiting\" does not automatically refer to the passage of time; we also use \"waiting\" to refer to passage through space (e.g. moving through a forest, field, desert) or looking through some broader setting (e.g. looking through the words printed on a page for typos). The stochastic variable of interest <i>X</i> represents the number of times we saw that event while we were \"waiting\". Since this is a count, we are still dealing with a discrete stochastic variable.</br></br>The cumulative probability function (CPF/CDF) for a Poisson situation is $$C_{Poi}\\left(x|\\lambda\\right)=\\sum^{x}_{i=0}\\left(\\frac{e^{-\\lambda}\\lambda^{i}}{i!}\\times\\Delta i\\right)$$ where the parameter $\\lambda$ is the expected number of \"successes\" per a given unit (e.g. how many successes we expect to see given we \"wait\" 500 words, or 100 meters, or 10 minutes). In a Poisson situation, you are typically given the value of $\\lambda$ (or told an estimate). (As is usual for Discrete Situations, we assume that $\\Delta i=1$.) The Rate of Change function (probability mass function) is defined as $$Poi\\left(x|\\lambda\\right)=\\frac{e^{-\\lambda}\\lambda^x}{x!}.$$ Examples of Poisson situations include the number of phone calls in a minute to a call center, locations of a particular species within a particular area, and the number of errors found on a printed page.When a stochastic variable follows a Poisson distribution, we will write $X\\sim\\mathcal{Poi}(\\lambda)$.

		`
	}
};