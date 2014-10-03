class BusinessController < ApplicationController
  	skip_before_filter :verify_authenticity_token, only: :submit
	layout 'business'
	def index
    	@top_fives = TopFive.where(user_id:current_user.id).collect{|e| e.serializable_hash({export_localized:true})}		
		render 'index'
	end
	def advertise
    	@top_fives = TopFive.where(user_id:current_user.id).collect{|e| e.serializable_hash({export_localized:true})}		
		render 'advertise'
	end	
	def submit
		@text = params.to_s
    	Email.delay.send_tim_an_email(@text)
    	render json: {}.as_json
	end
	def submit_advertising
		@text = params.to_s
    	Email.delay.send_tim_advertising_an_email(@text)
    	render json: {}.as_json
	end	
end
