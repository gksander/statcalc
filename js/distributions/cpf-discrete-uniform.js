statcalc.distributions["cpf-discrete-uniform"] = {
	render: function(){
		return `
			<h1 class='pretty'>Discrete Uniform Distribution</h1>

			<table class='input-table' align='center'>
				<tr>
					<td> Number of Unique Events ($N$) </td>
					<td> <input type='text' id='cpf-discrete-uniform-n' placeholder='n' value='6'/> </td>
				</tr>
				<tr>
					<td> Lower Limit </td>
					<td> <input type='text' id='cpf-discrete-uniform-l' placeholder='Lower Limit' value='1'/> </td>
				</tr>
				<tr>
					<td> Upper Limit (Max Num. of Successes) </td>
					<td> <input type='text' id='cpf-discrete-uniform-u' placeholder='Upper Limit' value='3'/> </td>
				</tr>
				<tr>
					<td colspan='2' class='text-center'>
						<button type='button' id='cpf-discrete-uniform-compute' class='compute'>Compute Probability</button>
					</td>
				</tr>
			</table>

			<h4>The Cumulative Probability of [Upper Limit] or a smaller value:</h4>
			<div id='cpf-discrete-uniform-calculation' class='calculation'></div>

			<div id='cpf-discrete-uniform-board' class='board'></div>
		`;
	},

	register: function(){
		$("#cpf-discrete-uniform-compute").on("click", function(){

			try {

				// Get values
				var a = math.eval($("#cpf-discrete-uniform-l").val()),
			        b = math.eval($("#cpf-discrete-uniform-u").val()),
			        n = math.eval($("#cpf-discrete-uniform-n").val());
			    // Do a little validation
			    if (a < 0 || b < 0 || b < a){
			    	throw "Improper bounds";
			    }

			    // Generate some html
			    var HTMLout = `
			    	\\[ \\sum_{i= ${a} }^{ ${b} } \\left( \\frac{1}{ ${n} } \\times \\Delta i \\right) = ${((1 / n) * (b - a + 1)).toFixed(statcalc.decimals)} \\]
			    `;
			    $("#cpf-discrete-uniform-calculation").html(HTMLout);
		        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

		        // JSXgraph stuff
		        $("#cpf-discrete-uniform-board").css({
		          width: "450px",
		          height: "350px"
		        });
		        var board = JXG.JSXGraph.initBoard('cpf-discrete-uniform-board', {
		          boundingbox: [-0.2, 1.2, Math.max(n, b) + 1, -0.2],
		          axis:true,
		          showNavigation: false,
		          showCopyright: false
		        })
		        board.create("functiongraph", [
		          function(x){return (Math.floor(x)*(Math.floor(x)+1))/(2*n)}
		          ,
		          0,
		          12
		        ], statcalc.jsxg.properties.functiongraph);
		        // Points with labels
		        board.create("point", [a, (Math.floor(a)*(Math.floor(a)+1))/(2*n)], statcalc.jsxg.properties.point)
		        board.create("text", [
		          a,
		          (Math.floor(a)*(Math.floor(a)+1))/(2*n),
		          "(" + a + ", <i>C<sub>DU</sub></i>(" + a + "|" + b + ", " + n + "))"
		        ], {
		          fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16
		        });
		        board.create("point", [b, (Math.floor(b)*(Math.floor(b)+1))/(2*n)], statcalc.jsxg.properties.point)
		        board.create("text", [
		          b,
		          (Math.floor(b)*(Math.floor(b)+1))/(2*n),
		          "(" + b + ", <i>C<sub>DU</sub></i>(" + b + "|" + b + ", " + n + "))"
		        ], {
		          fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16
		        });


			} catch(err){
				$("#cpf-discrete-uniform-calculation").html(`
					<p class="red">Invalid Input</p>
				`);
			}

		});
	},

	description: {
		title: "Discrete Uniform Distribution",
		body: `
    	Situations that we describe as \"discrete uniform situations\" differ from others in that the moment we specify all of the possible outcomes of the stochastic process, we automatically get the probability of any single outcome.  This comes from the fact that in these situations we will always assume that the stochastic process is \"fair\", meaning that each outcome has the same probability of occurring as any other outcome. The stochastic variable of interest is a discrete numeric value. <br/><br/> The cumulative probability function (CPF/CDF) for a discrete uniform situation is $$C_{DU}\\left(x|N\\right)=\\sum^x_{i=i}\\left(\\frac{1}{N}\\times\\Delta i\\right)$$ where the parameter <i>N</i> is the total number of different outcomes of the process and $\\Delta i$ is the change between any two adjacent values; we fix the value of $\\Delta i=1$. Notice that the summation starts at 1 rather than 0; <i>i</i> is the index of the outcomes rather than the value of the stochastic variable (i.e. 1 is the first outcome, 2 is the second outcome, etc.).  The Rate of Change function (probability mass function) is defined as $$DU\\left(x|N\\right)=\\frac{1}{N}.$$ When a stochastic variable follows a discrete uniform distribution, we will write $X\\sim\\mathcal{DU}(N)$.

		`
	}
};