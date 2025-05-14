var RENDERER = {
    INIT_CHERRY_BLOSSOM_COUNT: 30,
    MAX_ADDING_INTERVAL: 10,

    init: function () {
      this.setParameters();
      this.reconstructMethods();
      this.createCherries();
      this.render();
      if (
        navigator.userAgent.match(
          /(phone|pod|iPhone|iPod|ios|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        )
      ) {
        // var box = document.querySelectorAll(".box")[0];
        // console.log(box, "移动端");
        // box.style.marginTop = "65%";
      }
    },
    setParameters: function () {
      this.$container = $("#jsi-cherry-container");
      this.width = this.$container.width();
      this.height = this.$container.height();
      this.context = $("<canvas />")
        .attr({ width: this.width, height: this.height })
        .appendTo(this.$container)
        .get(0)
      var rate = this.FOCUS_POSITION / (this.z + this.FOCUS_POSITION),
        x = this.renderer.width / 2 + this.x * rate,
        y = this.renderer.height / 2 - this.y * rate;
      return { rate: rate, x: x, y: y };
    },
    re
  }
  //     } else {
  //       this.phi += Math.PI / (axis.y == this.thresholdY ? 200 : 500);
  //       this.phi %= Math.PI;
  //     }
  //     if (this.y <= -this.renderer.height * this.SURFACE_RATE) {
  //       this.x += 2;
  //       this.y = -this.renderer.height * this.SURFACE_RATE;
  //     } else {
  //       this.x += this.vx;
  //       this.y += this.vy;
  //     }
  //     return (
  //       this.z > -this.FOCUS_POSITION &&
  //       this.z < this.FAR_LIMIT &&
  //       this.x < this.renderer.width * 1.5
  //     );
  //   },
  // };
  $(function () {
    RENDERER.init();
  });