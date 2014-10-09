class BusinessController < ApplicationController
  	skip_before_filter :verify_authenticity_token, only: [:submit, :submit_advertising]
	layout 'business'
	def index
	    @top_fives_for_header = TopFive.is_active      
		render 'index'
	end
	def advertise
    	@top_fives_for_header = TopFive.is_active      		
		render 'advertise'
	end	
	def submit
		@text = params.to_s
    	Email.delay.send_tim_an_email(@text)
    	render json: {}.as_json
	end
	def submit_advertising
		@text = params.to_s
    	Email.delay.send_tim_an_advertising_email(@text)
    	render json: {}.as_json
	end	
end
