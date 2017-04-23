statcalc.distributions["cpf-lognormal"] = {
	render: function(){
		return `
	    <h1 class='pretty'>Log-normal Distribution</h1>

	    <table class='input-table' align='center'>
	      <tr>
	        <td> Location ($\\mu$) </td>
	        <td> <input type='text' id='cpf-lognormal-mu' placeholder='Location' value='1'/> </td>
	      </tr>
	      <tr>
	        <td> Shape ($\\sigma$) </td>
	        <td> <input type='text' id='cpf-lognormal-sigma' placeholder='Shape' value='2'/> </td>
	      </tr>
	      <tr>
	        <td> Lower Limit </td>
	        <td> <input type='text' id='cpf-lognormal-a' placeholder='Lower Limit' value='10'/> </td>
	      </tr>
	      <tr>
	        <td> Upper Limit </td>
	        <td> <input type='text' id='cpf-lognormal-b' placeholder='Upper Limit' value='20'/> </td>
	      </tr>
	      <tr>
	        <td colspan='2' class='text-center'>
	          <button type='button' id='cpf-lognormal-compute' class='compute'>Compute Probability</button>
	        </td>
	      </tr>
	    </table>

	    <h4>The Cumulative Probability of [Upper Limit] or smaller value:</h4>
	    <div id='cpf-lognormal-calculation' class='calculation'></div>

	    <div id='cpf-lognormal-board' class='board'></div>
		`;
	},

	register: function(){
		$("#cpf-lognormal-compute").on("click", function(){
			try {

				// # Get values
		        var a = math.eval($("#cpf-lognormal-a").val());
		        var b = math.eval($("#cpf-lognormal-b").val());
		        var mu = math.eval($("#cpf-lognormal-mu").val());;
		        var sigma = math.eval($("#cpf-lognormal-sigma").val());
		        // #Do some validation on the values
		        if( a < 0 || b < 0 || b < a) {
		          throw "Improper bounds";
		        }
		        // # Generate some output
		        var HTMLout = `
		        \\[ \\int\\limits_{ ${chopDecimals(a, 3)} }^{ ${chopDecimals(b, 3)} } \\frac{1}{x\\cdot ${chopDecimals(sigma, 3)} \\cdot \\sqrt{2\\pi }} \\exp\\left(-\\frac{(\\log t - ${chopDecimals(mu, 3)} )^2}{2\\cdot ${chopDecimals(sigma, 3)}^2}\\right) \\, dt = ${(jStat.lognormal.cdf(b, mu, sigma) - jStat.lognormal.cdf(a, mu, sigma)).toFixed(statcalc.decimals)} \\]
		        `;
		        $("#cpf-lognormal-calculation").html(HTMLout);
		        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

		        // # JSXGraph stuff....
		        $("#cpf-lognormal-board").css({
		          width: "450px",
		          height: "350px"
		        });
		        var board = JXG.JSXGraph.initBoard('cpf-lognormal-board', {
		          boundingbox: [-Math.max(10, b + 1)/10, 1.2, Math.max(10, b + 1), -0.2],
		          axis:true,
		          showNavigation: false,
		          showCopyright: false
		        });
		        board.create("functiongraph", [
		          function(x){return jStat.lognormal.cdf(x, mu, sigma);}
		        ], statcalc.jsxg.properties.functiongraph);
		        // #Points with labels
		        board.create("point", [a, jStat.lognormal.cdf(a, mu, sigma)], statcalc.jsxg.properties.point);
		        board.create("text", [
		          a,
		          jStat.lognormal.cdf(a, mu, sigma),
		          "$(" + a + ", C_{\\\\log}(" + a + "|" + mu + ", " + sigma + "))$"
		        ], {
		          fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16, useMathJax: true
		        })
		        board.create("point", [b, jStat.lognormal.cdf(b, mu, sigma)], statcalc.jsxg.properties.point);
		        board.create("text", [
		          b,
		          jStat.lognormal.cdf(b, mu, sigma),
		          "$(" + b + ", C_{\\\\log}(" + b + "|" + mu + ", " + sigma + "))$"
		        ], {
		          fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16, useMathJax: true
		        });

			} catch(err){
				$("#cpf-lognormal-calculation").html(
		          "<p class='red'>Invalid Input</p>"
		        )
			}
		})
	},

	description: {
		title: "Log-normal Distribution",
		body: `
      	The Log-normal distribution (a.k.a. the Galton distribution) is closely related to the Normal (Gaussian) distribution. There are some important differences to keep in mind. First, for the Log-normal stochastic variable, we can only observe positive values (zero is not positive) where Normal stochastic variable allows for positive, negative and zero. Second, the stochastic process underlying the Log-normal distribution relates to multiplication and the examination of growth rates. Thus, the sample geometric mean is the better estimate of the location parameter ($\\mu$) than the sample arithmetic mean. If <i>X</i> has a Log-normal distribution and we define $Y=\\log\\left(X\\right)$, then <i>Y</i> has a Normal Distribution. Important to note is that "log" ("common log") is not $\\log_{10}$ as you would find in pre-calculus or calculus classes. Rather "common log" in Statistics is $\\log_{e}$ or ln. </br></br> The Rate of Change (PDF) function for Log-normal situations is defined as $$LN\\left(x|\\mu,\\sigma\\right)=\\frac{1}{x\\sigma\\sqrt[2]{2\\pi}}\\text{exp}\\left(-\\frac{\\left(\\log x-\\mu\\right)^2}{2(\\sigma)^2}\\right)$$ where $\\mu$ is the location parameter and $\\sigma$ is the shape parameter.</br></br>The cumulative probability function (CPF/CDF) for a Log-normal situation is defined as $$C_{LN}\\left(x|\\mu,\\sigma\\right)=\\int_0^xLN\\left(t|\\mu,\\sigma\\right)\\cdot dt$$ When a stochastic variable follows a log-normal distribution, we will write $X\\sim \\mathcal{LOGN}(\\mu,\\sigma)$.

		`
	}
};