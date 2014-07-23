require 'oj'

class CopymenuController < ApplicationController
  before_filter :admin_user!
  layout 'administration'

  def index

  end

  def search
    result = Restaurant.where(:name => /#{params[:restaurant_name]}/i)
    result = result.limit(25)
  	render :json => result.as_json(:include => [:menus])
  end

  def initiate_copy    
    from = Restaurant.find(params["from"])
    to = Restaurant.find(params["to"])

    before = from.onlinesite_json

    to.preview_token = loop do
      token = SecureRandom.urlsafe_base64
      break token unless Restaurant.where(preview_token: token).count > 0
    end if to.preview_token.blank?

    to.menus.destroy_all
    # if to.menus.count > 0
    #   render json:{success:false}, status: 500
    #   return
    # end
    to.copy_menu_from_restaurant from

    from.reload
    after = from.onlinesite_json

    if before != after
      File.open("/tmp/before.json", 'w') { |file| file.write(before) }
      File.open("/tmp/after.json", 'w') { |file| file.write(after) }
      exit
    else
      Rails.logger.warn "PERFECT!!!"
    end 

    render json:{success:true}
  end
end
