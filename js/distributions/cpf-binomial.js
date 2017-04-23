statcalc.distributions["cpf-binomial"] = {
	render: function(){
		return `
		<h1 class='pretty'>Binomial Distribution</h1>

		<table class='input-table' align='center'>
			<tr>
				<td> Number of Trials ($n$) </td>
				<td> <input type='text' id='cpf-binomial-n' placeholder='n' value='8'/> </td>
			</tr>
			<tr>
				<td> Probability of \"Success\" ($p$) </td>
				<td> <input type='text' id='cpf-binomial-p' placeholder='p' value='0.6'/> </td>
			</tr>
			<tr>
				<td> Lower Limit </td>
				<td> <input type='text' id='cpf-binomial-l' placeholder='Lower Limit' value='2'/> </td>
			</tr>
			<tr>
				<td> Upper Limit (Max Num. of Successes) </td>
				<td> <input type='text' id='cpf-binomial-u' placeholder='Upper Limit' value='5'/> </td>
			</tr>
			<tr>
				<td colspan='2' class='text-center'>
				<button type='button' id='cpf-binomial-compute' class='compute'>Compute Probability</button>
				</td>
			</tr>
		</table>

		<h4>The Cumulative Probability of [Upper Limit] or fewer Successes:</h4>
		<div id='cpf-binomial-calculation' class='calculation'></div>

		<div id='cpf-binomial-board' class='board'></div>
		`;
	},

	register: function(){
		$("#cpf-binomial-compute").on("click", function(){
			try {

				// Get Value
				var a = math.eval($("#cpf-binomial-l").val()),
			        b = math.eval($("#cpf-binomial-u").val()),
			        p = math.eval($("#cpf-binomial-p").val()),
			        n = math.eval($("#cpf-binomial-n").val());
			    // Validation
			    if (a < 0 || b < 0 || b < a) {
			    	throw "Improper bounds";
			    }
			    // Compute some bounds
			    var cdf_a = jStat.binomial.cdf(a - 1, n, p),
			    	cdf_b = jStat.binomial.cdf(b, n, p);

			    var HTMLout = `
			    	\\[ \\sum_{i= ${chopDecimals(a, 3)} }^{ ${chopDecimals(b, 3)} }
			    	\\frac{ ${n} !}{i!\\left( ${n} -i\\right)!} ${chopDecimals(p, 3)} ^i ( ${chopDecimals((1 - p), 3)} )^{ ${chopDecimals(n, 3)} -i} = ${(cdf_b - cdf_a).toFixed(statcalc.decimals)} \\]
			    `;

			    $("#cpf-binomial-calculation").html(HTMLout);
			    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

			    // JSXGraph stuff....
		        $("#cpf-binomial-board").css({
		          width: "450px",
		          height: "350px"
		        });

		        var board = JXG.JSXGraph.initBoard('cpf-binomial-board', {
		          boundingbox: [-1, 1.3, n + 2, -0.3],
		          axis:true,
		          showNavigation: false,
		          showCopyright: false
		        });
		        board.create("functiongraph", [
		          function(x){return jStat.binomial.cdf(x, n, p);},
		          0,
		          n
		        ], statcalc.jsxg.properties.functiongraph);
		        // Points with labels
		        board.create("point", [a, jStat.binomial.cdf(a, n, p)], statcalc.jsxg.properties.point);
		        board.create("text", [
		          a,
		          jStat.binomial.cdf(a, n, p),
		          `(${a}, C<sub>B</sub>(${a}|${n}, ${p}))`
		        ], {
		          fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16
		        });
		        board.create("point", [b, jStat.binomial.cdf(b, n, p)], statcalc.jsxg.properties.point);
		        board.create("text", [
		          b,
		          jStat.binomial.cdf(b, n, p),
		          `(${b}, C<sub>B</sub>(${b}|${n}, ${p}))`
		        ], {
		          fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16
		        });


			} catch(err){console.log(err);};
		});
	},

	description: {
		title: "Binomial Distribution",
		body: `
			"A binomial situation is any situation that involves a binomial stochastic process.  Specifically, the stochastic process must relate to sequence of Bernoulli trials and the stochastic variable of interest is the count of \"successes\" in a fixed (and known) number of trials (represented by <i>X</i>). <br/><br/> The cumulative probability function (CPF, a.k.a. CDF) for a binomial situation is \\[ C_B\\left(x|n,p\\right)=\\sum_{i=0}^x\\left(\\frac{n!}{i!(n-i)!}p^j(1-p)^{(n-i)}\\times\\Delta i\\right)\\] where the parameter <i>n</i> is the total number of Bernoulli trials, the parameter <i>p</i> is the probability of \"success\", and the input <i>x</i> is the maximum number of successes we want to observe in the <i>n</i> trials. Since <i>X</i> is a discrete stochastic variable, $\\Delta i$ always equals one. The Rate of Change function (probability mass function) is defined as \\[ B\\left(x|n,p\\right)=\\frac{n!}{x!(n-x)!}p^{x}(1-p)^{(n-p)}.\\] When a stochastic variable follows a binomial distribution, we will write $X\\sim\\mathcal{Bin}(n,p)$."
		`
	}
}