class BusinessController < ApplicationController
  	skip_before_filter :verify_authenticity_token, only: :submit
	layout 'business'
	def index
		render 'index'
	end
	def submit
		@text = params.to_s
    	Email.delay.send_tim_an_email(@text)
    	render json: {}.as_json
	end
end
