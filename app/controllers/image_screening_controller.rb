class ImageScreeningController < ApplicationController
  before_filter :admin_user!
  layout 'administration'

  def index
    render 'index'
  end

  def load_more
    @images = Image.unscoped.where(unverified:true).limit(15)
    render json:@images.as_json
  end
end
