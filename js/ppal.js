    paypal.Button.render({
    
        env: 'production', // Specify 'sandbox' for the test environment

        client: {
        	production: 'AVzTZtS_HCJraODQyNBBMGyN83WbaG5UJF4z4C3Z7Hi2ppdP4E4c_9BWvJ-tvJDOu-NL12Ka4UqlpCwm'
        },

        payment: function() {
            // Set up the payment here, when the buyer clicks on the button
            var env = this.props.env;
            var client = this.props.client;

            return paypal.rest.payment.create(env, client, {
            	transactions: [
            		{
            	    	amount: {total: '1.00', currency: 'USD'}
            		}
            		
            	]

            });
        },

        commit: true,

        onAuthorize: function(data, actions) {
            // Execute the payment here, when the buyer approves the transaction
            return actions.payment.execute().then(function() {

            });
       }
            
    }, '#paypal-button');