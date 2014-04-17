class ProfileController < ApplicationController
	before_filter :authenticate_user!

	layout 'administration'

	def edit
		render 'edit'
	end

	def billing
		@default_card = ""
		@plans = Plan.new.plans
		if user = current_user and user.stripe_token
			begin
				customer = Stripe::Customer.retrieve(user.stripe_token)	
			rescue Stripe::APIConnectionError => message
				Rails.logger.warn "Error with stripe.\n#{msg.to_s}"
				bad = true
			end
			if !bad
				@default_card = customer["default_card"]
				user.cards = customer["cards"]["data"].collect{|e| e.to_hash}
				user.save
			end
		end
		render 'billing'
	end

	def add_card
		user = current_user
		data = JSON.parse(params[:data])
		if user.stripe_token.blank?
			begin
				customer = Stripe::Customer.create(
													:email => user.email,
													:description => user.owns_restaurants.name,
													:card => data["id"],
							)
			rescue Stripe::APIConnectionError => message
				Rails.logger.warn "Error with stripe.\n#{msg.to_s}"
				render json: {success:false}.as_json
				return
			end
			user.stripe_token = customer.id
		end
		# if !user.cards.any?{|e| e["id"] == data["id"]}		
		# 	user.cards << data["card"]
		# end
		user.save
		render json: {success:true}.as_json
	end

	def create_charge
		# Amount in cents
		@amount = 500

		begin
			customer = Stripe::Customer.create(
				:email => 'example@stripe.com',
				:card  => params[:stripeToken]
				)
			charge = Stripe::Charge.create(
				:customer    => customer.id,
				:amount      => @amount,
				:description => 'Rails Stripe customer',
				:currency    => 'usd'
				)
		rescue Stripe::CardError => e
			flash[:error] = e.message
			redirect_to charges_path
		end
	end

end
