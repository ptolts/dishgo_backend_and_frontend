class WebsiteController < ApplicationController
	before_filter :authenticate_user!
	before_filter :admin_user!, :only => []
	before_filter :admin_or_owner!, :only => [:submit_design, :destroy_image, :destroy_gallery_image, :upload_gallery]
	layout 'build_online_site'

	def index
		restaurant = current_user.owns_restaurants
		if !restaurant.design
			dezign = Design.where(name:/garde/i).first
			restaurant.design = dezign
		else
			dezign = restaurant.design
		end
		@design_id = dezign.id
		@design_id = restaurant.design.id if restaurant.design	
		@font_id = Font.all.first.id
		@font_id = restaurant.font.id if restaurant.font					
		@designs = all_designs
		@fonts = Font.all.as_json
		@sections = restaurant.published_menu.collect{|s| s_h = s.as_document; s_h["name"] = s.name_translations; next s_h}.as_json
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
	      cache.menu = nil
	      cache.save
	    end

		data = JSON.parse(params[:data])
		section_data = JSON.parse(params[:sections_data])
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
			p.position = page["position"].to_i
			p.save
			next p
		end
		section_data.each do |sec|
			section = Section.find(sec["id"])
			section.menu_link = sec["menu_link"]
			section.save
		end
		restaurant.pages = pages
		restaurant.email_addresses = restaurant_data["email_addresses"]
		restaurant.preview_token = loop do
			token = SecureRandom.urlsafe_base64
			break token unless Restaurant.where(preview_token: token).count > 0
		end if restaurant.preview_token.blank?
		restaurant.show_map = restaurant_data["show_map"].to_bool
		restaurant.show_hours = restaurant_data["show_hours"].to_bool
		restaurant.show_menu = restaurant_data["show_menu"].to_bool
		restaurant.show_gallery = restaurant_data["show_gallery"].to_bool
		restaurant.default_language = restaurant_data["default_language"].to_s
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

	def upload_gallery
		file = params[:files]
		resto = current_user.owns_restaurants
		md5_sum = Digest::MD5.hexdigest(file.read)

		img = Image.create
		img.restaurant_gallery = Restaurant.find(params[:restaurant_id])
		img.update_attributes({:img => file})
		img.manual_img_fingerprint = md5_sum
		img.save
		images = [img]

		render :json => {files: images.collect{ |img|
		                  {
		                    image_id: img.id,
		                    name: img.img_file_name,
		                    size: img.img_file_size,
		                    original:  img.img_url_original,
		                    small:  img.img_url_original,
		                    thumbnailUrl:   img.img_url_original,
		                  }
		                }}.as_json
	end	

	def destroy_image
		image = GlobalImage.find(params[:image_id])
		image.destroy
		render :json => {"Success"=>true}.as_json
	end

	def destroy_gallery_image
		image = Image.find(params[:image_id])
		image.destroy
		render :json => {"Success"=>true}.as_json
	end	

end
