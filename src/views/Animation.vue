<template>
    <div id="anim-holder" ref="anim-holder" style="height:100%;width:100%;top:0;backgroud:red"> 
      <div id='anime' ></div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

  export default {
    computed: {
     ...mapGetters({
        isInit : 'IsInit',
        p5Instance: 'Getp5Instance',
        showDrop: 'getDropzoneState',
     })
    },
    methods: {
    ...mapActions([
   	 		'startAnimation','stopAnimation'
   			]),
    },
    mounted: function () {
      console.log("Animation mounted")
      if(this.isInit){
        this.startAnimation();
        if (document.getElementById("anime").children.length == 0) { 
          console.log("reinstancing canvas");
          document.getElementById("anime").appendChild(this.p5Instance.canvas)
        } 
      }
      
      
    },
    beforeDestroy: function(){
      console.log("Animation component destory");
      //this.stopAnimation();

    }
}
</script>


<style>

</style>
