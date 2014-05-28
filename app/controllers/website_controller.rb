class WebsiteController < ApplicationController
	before_filter :authenticate_user!
	before_filter :admin_user!, :only => []
	before_filter :admin_or_owner!, :only => [:submit_design,:destroy_image]
	layout 'build_online_site'

	def index
		if !current_user.owns_restaurants.design
			dezign = Design.where(name:/garde/i).first
			current_user.owns_restaurants.design = dezign
		else
			dezign = current_user.owns_restaurants.design
		end
		@design_id = dezign.id
		@design_id = current_user.owns_restaurants.design.id if current_user.owns_restaurants.design	
		@font_id = Font.all.first.id
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
						# Rails.logger.warn img[:global_images].to_s
						default["default_image"] = true
						# Rails.logger.warn img[:global_images].to_s						
					end
				end
			end
			#Add all images which are actually carousels.
			# Rails.logger.warn "---\n#{custom_imgs.to_s}\n-----" 
			des_json[:global_images] = custom_imgs + restaurant.global_images.select{|e| e.carousel}.as_json
			des_json
		end
		hash_designs
	end

	def submit_design

	    #when the user first edits the website, make the website editor visible in his toolbar.
	    # unless current_user.sign_up_progress["website"]
	    #   u = current_user
	    #   u.sign_up_progress["website"] = true
	    #   u.save
	    # end

		restaurant = Restaurant.find(params[:restaurant_id])

	    if cache = restaurant.cache
	      cache.website = nil
	      cache.save
	    end

		data = JSON.parse(params[:data])
		restaurant_data = JSON.parse(params[:restaurant_data])
		settings = restaurant.website_settings || {}
		data["global_images"].each do |image|
			# Rails.logger.warn "------\n#{image}\n-----"
			if image["custom"].to_bool
				settings[image["name"]] = image["id"]
			else
				# Rails.logger.warn "--\n'#{image}'\n---"
				# Rails.logger.warn settings
				settings[image["defaultImage"]["name"]] = image["defaultImage"]["id"]
			end
		end
		# Rails.logger.warn "--++++-\n#{settings}\n--+++++--"
		restaurant.website_settings = settings
		restaurant.languages = restaurant_data["languages"]
		restaurant.design = Design.find(data["id"])
		restaurant.font = Font.find(params["font_id"])
		restaurant.logo_settings = restaurant_data["logo_settings"]
		# Rails.logger.warn restaurant_data
		restaurant.about_text_translations = restaurant_data["about_text"]

		pages = restaurant_data["pages"].collect do |page|
			p = Page.where(id:page["id"]).first
			if !p
				p = Page.create
			end
			p.name_translations = page["name"]
			p.html_translations = page["html"]
			p.save
			next p
		end
		restaurant.pages = pages
		restaurant.email_addresses = restaurant_data["email_addresses"]
		restaurant.preview_token = loop do
			token = SecureRandom.urlsafe_base64
			break token unless Restaurant.where(preview_token: token).count > 0
		end if restaurant.preview_token.blank?
		restaurant.save		
		render :json => {preview:"/app/onlinesite/preview/#{restaurant.preview_token.to_s}"}.as_json
	end

	def upload_logo
		data = JSON.parse(params[:data])
		file = params[:files]
		img = current_user.owns_restaurants.logo
		if !img
			img = GlobalImage.create
			user = current_user 
			user.owns_restaurants.logo = img
			user.save
		end
		img.name = params[:name]
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
