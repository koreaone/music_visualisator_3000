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
   	 		'instanciateP5'
   			]),
    },
    mounted: function () {
      if(this.isInit == false){
        this.instanciateP5()
      }
      else{
        document.getElementById("anime").appendChild(this.p5Instance.canvas)
      }
      
    }
}
</script>


<style>

</style>
