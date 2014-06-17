class RobotsController < ApplicationController

  layout 'administration'
  
  def index
  	resto_name = request.subdomain.split(".").first
    if !resto_name.blank?
      restaurant = Restaurant.where(:subdomain => resto_name).first
    end
    if !restaurant and request.host.to_s != 'dishgo.io'
      restaurant = Restaurant.where(:host => request.host.to_s.downcase.gsub(/www\./,'')).first
    end
    if host = restaurant.host
  		robots = "Sitemap: http://www.#{host}/sitemap.xml"
  	else
  		robots = "Sitemap: http://#{restaurant.subdomain}dishgo.io/sitemap.xml"
  	end
  	render text: robots
  end
end
