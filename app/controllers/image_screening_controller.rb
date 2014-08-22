class ImageScreeningController < ApplicationController
  before_filter :admin_user!
  layout 'administration'

  def index
    render 'index'
  end

  def load_more
    @images = Image.unscoped.where(unverified:true).ne(garbage:true).limit(15)
    render json:@images.as_json
  end

  def accept
    img = Image.find(params[:image_id])
    img.unverified = false
    img.save!
    render json:true
  end

  def accept
    img = Image.unscoped.find(params[:image_id])
    img.unverified = false
    img.save!
    render json:true
  end

  def reject
    img = Image.unscoped.find(params[:image_id])
    img.garbage = true
    img.save!
    render json:true
  end  
end
