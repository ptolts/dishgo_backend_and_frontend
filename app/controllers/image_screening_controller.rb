class ImageScreeningController < ApplicationController
  before_filter :admin_user!
  layout 'administration'

  def index
    render 'index'
  end

  def load_more
    @images = Image.unverified.with_user.desc(:created_at).limit(15)
    @images = @images.collect{|e| e.serializable_hash({dish:true, restaurant:true, user:true})}
    render json:@images.as_json
  end

  def accept
    img = Image.unscoped.find(params[:image_id])
    img.unverified = false
    img.save!
    render json:true
  end

  def update_restaurants
    CacheJson.new.delay.rebuild_restaurants_with_rejected_images
    render json:true
  end

  def reject
    img = Image.unscoped.find(params[:image_id])
    img.rejected = true
    img.save!
    if img.restaurant
      tracker = TrackRestaurantsToRebuild.first || TrackRestaurantsToRebuild.create
      tracker.restaurant_ids << img.restaurant.id
      tracker.restaurant_ids.uniq!
      tracker.save!
    end
    render json:true
  end  
end
