
      // Randomly add a data point every 500ms
      var random = new TimeSeries();
      setInterval(function() {
        random.append(new Date().getTime(), Math.random() * 10000);
      }, 500);
      
      function createTimeline() {
        var chart = new SmoothieChart({responsive: true, labels:{fontSize:15},timestampFormatter:SmoothieChart.timeFormatter});
        chart.addTimeSeries(random, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
        chart.streamTo(document.getElementById("chart"), 500);
      }
