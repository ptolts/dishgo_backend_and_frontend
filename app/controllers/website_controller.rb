class WebsiteController < ApplicationController
	before_filter :authenticate_user!
	before_filter :admin_user!, :only => []
	before_filter :admin_or_owner!, :only => [:submit_design,:destroy_image]
	layout 'administration'

	def index
		# unless current_user.owns_restaurants.design
		# 	current_user.owns_restaurants.design = Design.first
		# end
		# unless current_user.owns_restaurants.font
		# 	current_user.owns_restaurants.font = Font.first
		# end
		@design_id = ""
		@design_id = current_user.owns_restaurants.design.id if current_user.owns_restaurants.design	
		@font_id = ""
		@font_id = current_user.owns_restaurants.font.id if current_user.owns_restaurants.font					
		@designs = all_designs
		@fonts = Font.all.as_json
		render 'website'
	end

	def all_designs
		designs = Design.all
		restaurant = current_user.owns_restaurants
		custom_images = restaurant.global_images
		settings = restaurant.website_settings || {}
		hash_designs = designs.collect do |des|
			des_json = des.as_json
			# Replace default images which are allowed to be customized with already customized images.
			allowed_images = des.global_images.reject{|i| next !i.customizable}
			allowed_images_names = allowed_images.collect{|e| e.name}
			custom_imgs = custom_images.reject{|e| !allowed_images_names.include?(e.name)}
			allowed_images_names = custom_imgs.collect{|e| e.name}
			custom_imgs = custom_imgs + allowed_images.reject{|e| allowed_images_names.include?(e.name)}
			custom_imgs = custom_imgs.as_json
			custom_imgs.each do |img|
				if settings[img["name"]]
					# img[:global_images].select{|e| Rails.logger.warn "#{e["_id"].to_s} == #{settings[img["name"]]}"}
					if default = img[:global_images].select{|e| e["_id"].to_s == settings[img["name"]]} and default = default.first
						img[:global_images].each{|e| e["default_image"] = false}
						Rails.logger.warn img[:global_images].to_s
						default["default_image"] = true
						Rails.logger.warn img[:global_images].to_s						
					end
				end
			end
			#Add all images which are actually carousels. 
			des_json[:global_images] = custom_imgs + restaurant.global_images.select{|e| e.carousel}.as_json
			des_json
		end
		hash_designs
	end

	def submit_design
		restaurant = Restaurant.find(params[:restaurant_id])
		data = JSON.parse(params[:data])
		restaurant_data = JSON.parse(params[:restaurant_data])
		settings = restaurant.website_settings || {}
		data["global_images"].each do |image|
			Rails.logger.warn "------\n#{image}\n-----"
			if image["custom"]
				settings[image["name"]] = image["id"]
			else
				settings[image["defaultImage"]["name"]] = image["defaultImage"]["id"]
			end
		end
		Rails.logger.warn "--++++-\n#{settings}\n--+++++--"
		restaurant.website_settings = settings
		restaurant.save
		restaurant.design = Design.find(data["id"])
		restaurant.font = Font.find(params["font_id"])
		restaurant.about_text_translations = restaurant_data["about_text"]
		restaurant.save		
		render :json => {preview:"/app/onlinesite/preview/#{restaurant.preview_token.to_s}"}.as_json
	end

	def upload_image
		data = JSON.parse(params[:data])
		file = params[:files]
		img = GlobalImage.where(id:params[:id]).first
		if img and img.design
			img = GlobalImage.create
		end
		img = GlobalImage.create unless img
		img.name = params[:name]
		img.custom = true
		img.carousel = data["carousel"]
		img.restaurant = Restaurant.find(params[:restaurant_id])
		img.update_attributes({:img => file})
		img.save

		render :json => {files:[{
		                    image_id: img.id,
		                    name: img.name,
		                    url:  img.img_url_original,
		                    custom: true,
		                  }]
		                }.as_json
	end

	def destroy_image
		image = GlobalImage.find(params[:image_id])
		image.destroy
		render :json => {"Success"=>true}.as_json
	end

end
