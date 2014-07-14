class LetsdishgoController < ApplicationController
  	skip_before_filter :verify_authenticity_token, only: [:charge]
	layout 'letsdishgo'

	def index
		if current_user and current_user.owns_restaurants
			@restaurant = current_user.owns_restaurants.serializable_hash
			@restaurant[:menu_files] = current_user.owns_restaurants.menu_files.collect{|e| e.serializable_hash}
			@restaurant = @restaurant.to_json
		end
		@restaurant ||= {}.to_json
		render 'index'
	end

	def create_user_and_restaurant
		data = JSON.parse(params[:params])
		email = data["email"]
		phone = data["phone"]    
		if User.where(:email => email).count > 0
		  render :json => {result: "User Exists!"}.as_json
		  return
		end
		user = User.new(:email => email, :phone => phone)
		user.skip_confirmation!
		user.skip_confirmation_notification!
		user.save!(:validate => false)
		restaurant = Restaurant.create(name:"Restaurant Name")
		user.owns_restaurants = restaurant
		user.save
		restaurant.reload
		# Email.sign_up_link(user)
		sign_in user
		json = {}  
		json["user"] = user.serializable_hash
		json["user"][:sign_up_link_field] = user.sign_up_link_field
		json["restaurant"] = restaurant.serializable_hash
		render :json => json.to_json
	end 

	def upload_menu_file
		file = params[:files]
		resto = current_user.owns_restaurants
		menu_file = MenuFiles.create
		menu_file.restaurant = resto
		menu_file.update_attributes({:menu_file => file})
		menu_file.save

		render :json => {
		                    name: 	menu_file.name,
		                    url: 	menu_file.url,
		                    id: 	menu_file.id,
		                }.as_json

	end

	def destroy_file
		file = MenuFiles.find(params[:id])
		file.destroy
		render json: {success:true}.as_json
	end	

	def charge
		begin
		  charge = Stripe::Charge.create(
		    :amount => 3500, # amount in cents, again
		    :currency => "cad",
		    :card => params[:stripeToken],
		    :description => params[:stripeEmail],
		  )
		rescue Stripe::CardError => e
		  render 'declined'
		  return
		end
		render 'charge'
	end	

	def user_check
		Rails.logger.warn params.to_s
		user = User.where(email:params[:email]).count
		render json: {exists:(user > 0) ? true : false}.as_json
	end
end
