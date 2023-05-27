
document.addEventListener('DOMContentLoaded', function () {
    let expressions = document.getElementById('expressions');
    let graph = document.getElementById('graph');

    let Calc1 = Desmos.GraphingCalculator(expressions, {
        graphpaper: false,
    });

    let Calc2 = Desmos.GraphingCalculator(graph, {
        expressions: false,
    });

    Calc1.observeEvent('change', function () {
        Calc2.setState(Calc1.getState());
    });

    Calc1.setExpression({ id: 'graph1', latex: 'y=x^2' });

});