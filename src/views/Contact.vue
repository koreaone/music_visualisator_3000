<template>
    <v-card flat width="100%" height="100%" style="text-align:justify">
        <v-card-title class="ml-4">
            <h1><b>Contact</b></h1>
        </v-card-title >
        <form class="px-4">
            <v-text-field v-model="name" v-validate="'required|max:10'" :counter="10" :error-messages="errors.collect('name')" label="Name" data-vv-name="name" required></v-text-field>
            <v-text-field v-model="email" v-validate="'required|email'" :error-messages="errors.collect('email')" label="E-mail" data-vv-name="email" required></v-text-field>
            <v-select v-model="select" v-validate="'required'" :items="items" :error-messages="errors.collect('select')" label="Select" data-vv-name="select" required></v-select>
            <v-textarea v-model="message" v-validate="'required|max:300'" :counter="300" :error-messages="errors.collect('message')" label="Message" data-vv-name="message" required outline class="mt-4"></v-textarea>
            <v-checkbox v-model="checkbox" v-validate="'required'" :error-messages="errors.collect('checkbox')" value="1"  label="Read & Agree with terms and conditions" data-vv-name="checkbox" type="checkbox" required></v-checkbox> 
            <div class="mt-2">
                <v-btn color="primary" @click="submit">submit</v-btn>
                <v-btn color="error" @click="clear">clear</v-btn>
            </div>
        </form>    
    </v-card>
</template>


<script>
import { mapActions } from 'vuex'

export default {
    $_veeValidate: {
      validator: 'new'
    },
    data: () => ({
      name: '',
      email: '',
      message: '',
      select: null,
      items: [
        'Feedback',
        'Bug/Fix',
        'Other',
      ],
      checkbox: null,
      dictionary: {
        attributes: {
          email: 'E-mail Address'
        },
        custom: {
          name: {
            required: () => 'Name can not be empty',
            max: 'The name field may not be greater than 10 characters'
            // custom messages
          },
          message: {
            required: () => 'Message can not be empty',
            max: 'The name field may not be greater than 300 characters'
          },
          select: {
            required: 'Select field is required'
          }
        }
      }
    }),

    mounted () {
      this.$validator.localize('en', this.dictionary)
    },

    methods: {
        ...mapActions([
   	 		'sendMessage','setSnackbar'
   			]),
        submit () {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    this.sendMessage({name: this.name, email:this.email, object:this.select, message: this.message });
                    this.name = '';
                    this.email = '';
                    this.select = null;
                    this.checkbox = null;
                    this.message = '';
                    return;
                }   
            });
            this.setSnackbar({text :"The form is not correct !"});
        },
        clear () {
            this.name = '';
            this.email = '';
            this.select = null;
            this.checkbox = null;
            this.message = '';
            this.$validator.reset();
        }
    }
  }
</script>
