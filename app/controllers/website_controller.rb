class WebsiteController < ApplicationController
	before_filter :authenticate_user!
	before_filter :admin_user!, :only => []
	before_filter :admin_or_owner!, :only => [:submit_design]
	layout 'administration'

	def index
		@designs = all_designs
		render 'website'
	end

	def all_designs
		designs = Design.all
		custom_images = current_user.owns_restaurants.global_images
		hash_designs = designs.collect do |des|
			des_json = des.as_json
			# Replace default images which are allowed to be customized with already customized images.
			allowed_images = des.global_images.reject{|i| next !i.customizable}
			allowed_images_names = allowed_images.collect{|e| e.name}
			custom_imgs = custom_images.reject{|e| !allowed_images_names.include?(e.name)}
			allowed_images_names = custom_imgs.collect{|e| e.name}
			custom_imgs = custom_imgs + allowed_images.reject{|e| allowed_images_names.include?(e.name)}
			des_json[:global_images] = custom_imgs.as_json
			des_json
		end
		hash_designs
	end

	def submit_design
		restaurant = Restaurant.find(params[:restaurant_id])
		data = JSON.parse(params[:data])
		restaurant.design = Design.find(data["id"])
		restaurant.save
		render :text => "Success!"
	end

	def upload_image
		file = params[:files]
		img = GlobalImage.where(id:params[:id]).first
		if img and img.design
			img = GlobalImage.create
		end
		img = GlobalImage.create unless img
		img.name = params[:name]
		img.restaurant = Restaurant.find(params[:restaurant_id])
		img.update_attributes({:img => file})
		img.save

		render :json => {files:[{
		                    image_id: img.id,
		                    name: img.name,
		                    url:  img.img_url_original,
		                  }]
		                }.as_json
	end  

end
