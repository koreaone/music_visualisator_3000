<template>
  <div style="height:100%; width:100%">
    <div  id="anim-holder" ref="anim-holder" style="height:100%;width:100%;top:0"> 
      <div id='anime'></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

  export default {
    data: () => ({
      anim_ready : false
    }),
    computed: {
     ...mapGetters({
        isInit : 'IsInit',
        p5Instance: 'Getp5Instance',
        anim_ready_store : 'getAnimready'
     })
    },
    watch: {
      anim_ready_store(newCount, oldCount){
        this.anim_ready = newCount;
        if(this.anim_ready){
          this.startAnimation();
          if (document.getElementById("anime").children.length == 0) {
            document.getElementById("anime").appendChild(this.p5Instance.canvas)
          } 
        }
      },
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
      this.stopAnimation();
    }
}
</script>


<style>

</style>
