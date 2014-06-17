class RobotsController < ApplicationController  
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

  def sitemap
  	resto_name = request.subdomain.split(".").first
    if !resto_name.blank?
      restaurant = Restaurant.where(:subdomain => resto_name).first
    end
    if !restaurant and request.host.to_s != 'dishgo.io'
      restaurant = Restaurant.where(:host => request.host.to_s.downcase.gsub(/www\./,'')).first
    end
    if !restaurant
    	restaurant = Restaurant.where(name:/bobs/i).first
    end
    if host = restaurant.host
  		url = "http://www.#{host}/"
  	else
  		url = "http://#{restaurant.subdomain}dishgo.io/"
  	end

    sitemapxml = %@<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\nCONTENTS_HERE_SITEMAP\n</urlset>@
    sitemap_url = %@\t<url>
		<loc>#{url}LOCATION_CHANGE</loc>
		<changefreq>weekly</changefreq>
		<priority>1.0</priority>
	</url>@
	sitemap = []

	pages = ['menu','contact']
	restaurant.pages.each do |page|
		pages << page.name
	end

	pages.each do |page|
		sitemap << sitemap_url.gsub(/LOCATION_CHANGE/,"#!/#{page}")
	end

	sitemapxml.gsub!(/CONTENTS_HERE_SITEMAP/,sitemap.join("\n"))

  	render text: sitemapxml
  end 
end