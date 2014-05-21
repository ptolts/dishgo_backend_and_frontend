class Api::V1::RestaurantAdminController < ApplicationController
  respond_to :json
  skip_before_filter :verify_authenticity_token
  before_filter :api_admin_or_owner!
  
  def upload_image
    resto = current_user.owns_restaurants
    data = params
    file = Base64.decode64(data[:image_data])
    md5_sum = Digest::MD5.hexdigest(file)
    if img = Image.where(:manual_img_fingerprint => md5_sum, :restaurant_id => resto.id).first and img
      images = [img]
    else
      img = Image.create
      img.restaurant = Restaurant.find(data[:restaurant_id])
      img.update_attributes({:img =>  StringIO.new(file)})
      img.manual_img_fingerprint = md5_sum
      dish = Dish.find(params[:dish_id])
      img.save
      dish.image << img
      images = [img]
    end
    render :json => {success:true}.as_json
  end

end