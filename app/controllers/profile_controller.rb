class ProfileController < ApplicationController
	before_filter :authenticate_user!
	before_filter :create_notifications!

	layout 'profile'

	def edit
		render 'edit'
	end

	def location
		@resto_data = current_user.owns_restaurants
		render 'location'
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

	def subscribe
		data = JSON.parse(params[:data])
		begin
			customer = Stripe::Customer.retrieve(current_user.stripe_token)	
			if customer["subscriptions"]["total_count"] == 0
				customer.subscriptions.create(:plan => data["id"])			
			else plan = customer["subscriptions"]["data"].first
				Rails.logger.warn plan.to_s
				plan = customer.subscriptions.retrieve(plan["id"])
				customer.update_subscription(:plan => data["id"])
			end	
		rescue Stripe::APIConnectionError => message
			Rails.logger.warn "Error with stripe.\n#{msg.to_s}"
			bad = true
		end		
		if !bad
			user = current_user
			user.plan = data
			user.save
		end
		render json: {success:true}.as_json
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

	def smoke_notifications
		# data = JSON.parse(params[:data])
		user = current_user
		# user.notifications.delete_if{|i| i[:id] == data["id"]}
		# user.save
		user.notifications.each do |e| 
			e.read = true
			e.save
			Rails.logger.warn e.to_json
		end
		render json:{success:true}
	end

end
