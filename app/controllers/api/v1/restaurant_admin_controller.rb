class Api::V1::RestaurantAdminController < ApplicationController
  respond_to :json
  skip_before_filter :verify_authenticity_token
  before_filter :authenticate_user!
  before_filter :api_admin_or_owner_variable_only!
  before_filter :api_admin_or_owner!, except: [:upload_image_file]
  
  def upload_image
    resto = current_user.owns_restaurants
    data = params
    file = Base64.decode64(data[:image_data])
    md5_sum = Digest::MD5.hexdigest(file)
    if img = Image.where(:manual_img_fingerprint => md5_sum, :restaurant_id => resto.id).first and img
      images = [img]
    else
      img = Image.new
      img.restaurant = resto
      img.update_attributes({:img =>  StringIO.new(file)})
      img.manual_img_fingerprint = md5_sum
      dish = Dish.find(params[:dish_id])
      img.save
      dish.image << img
      dish.draft_image << img
      images = [img]
    end
    render :json => {success:true}.as_json
  end

  def upload_image_file
    resto = Restaurant.find(params[:restaurant_id])
    data = params
    file = params[:image]
    md5_sum = Digest::MD5.hexdigest(file.read)

    img = Image.new
    img.restaurant = resto
    img.user = current_user
    img.update_attributes({:img => file})
    img.manual_img_fingerprint = md5_sum
    dish = Dish.find(params[:dish_id])
    dish.image << img
    dish.draft_image << img
    dish.save 
    img.save

    if !@admin
      user = current_user
      user.dishcoins = user.dishcoins + 1
      user.save(verified: false)
    end

    if @admin or @owner
      img.unverified = false
      img.save
      resto
    end

    render :json => {url:img.img_url_original}.as_json
  end  

end