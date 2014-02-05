class Api::V1::RestaurantsController < ApplicationController
  respond_to :json
  after_filter :set_access_control_headers

  def set_access_control_headers 
    headers['Access-Control-Allow-Origin'] = '*' 
    # headers['Access-Control-Allow-Origin'] = 'http://dev.foodcloud.ca' 
  end


  # def index
  #   sources = Rails.cache.fetch("restaurants#{params.to_s}", expires_in: 1.day) do
  #     sources = (Sources.new.by_loc [params[:lat].to_f,params[:lon].to_f]).collect{|e| e.attributes.inject({}){|res,x| res[x[0]]=x[1]; res}}
  #     sources.each do |e|
  #       if e["images"]
  #         possible = e["images"].find_all{|f| f["local_url"]}
  #         if possible and !possible.empty?
  #           possible = possible.sort_by{|f| f["likes"]}.last
  #           e["img"] = possible["local_url"]
  #         end
  #       else
  #         # e["img"] = "4c79386a97028cfa8a38dafe/540e03db7fbb260a07b0c8647c48cdc008a29d73.jpg"
  #       end
  #     end
  #     sources.reject!{|e| e["img"].nil?}
  #     sources
  #   end

  #   respond_with sources
  # end

  # def index

  #   sources = Rails.cache.fetch("restaurants", expires_in: 1.second) do
  #     (Restaurant.new.by_loc [45.458972,-74.155815]).to_a
  #   end

  #   sources = sources.collect do |c|
  #     # Rails.logger.warn c.images.to_json
  #     next {
  #       :id => c["_id"],
  #       :name => c.name,
  #       :address => c.address,
  #       :lat => c.lat,
  #       :lon => c.lon,
  #       :phone => c.phone,
  #       :images => c.images.reject do |e|
  #         if e.nil?
  #           next true
  #         elsif e["face_found"] or e["text_found"]
  #           Rails.logger.warn "Rejecting:\nhttp://dev.foodcloud.ca:3000/assets/sources/#{e['local_url']}\n#{e.to_s}\n---------\n"
  #           next true
  #         else
  #           next false
  #         end
  #       end.collect do |f|
  #         new_file = f['local_url'].scan(/(.*)\.(.+)/).first
  #         new_file = new_file[0] + "_final." + new_file[1]
  #         next {:url => new_file, :id => f["_id"]}
  #       end
  #     }
  #   end
  #   Rails.logger.warn "Outputted #{sources.size} items."
  #   respond_with sources
  # end

  def index

    sources = Rails.cache.fetch("restaurants", expires_in: 1.second) do
      (Restaurant.new.by_loc [45.458972,-74.155815]).to_a
    end

    # sources = sources.collect do |c|
    #   c.image.reject!{|e| e.rejected}
    #   next c
    # end
    # Rails.logger.warn "Outputted #{sources.size} items."

    sources_asjson = sources.as_json(:except => [:locs], :include => {:image => {:only => [:_id,:local_file,:rejected]}})
    sources_asjson.each do |so|
      so['image'].delete_if{|img| next ((img['rejected'].to_s == 'true') or (img['rejected'].to_s == '1'))}
    end

    respond_with sources_asjson
  end

  def unique_id restaurant
    @count ||= 0
    @count += 1
    return restaurant.id.to_s + @count.to_s
  end

  def menu
    if params[:id].empty?
      Rails.logger.warn "Empty ID"
      render :text => {}.to_json
      return
    end
    restaurant = Restaurant.find(params[:id])
    # restaurant = Restaurant.includes(:section => {:subsection => {:dish => [{:options => {:option => :icon}}, :images]}}).find(params[:id])
    if restaurant.nil? or restaurant.section.empty?
      # Rails.logger.warn "Restaurant.nil? #{restaurant.nil?} or Restaurant.section.empty? #{restaurant.section.empty?} and size: #{restaurant.section.size}"
      # render :text => {}.to_json
      # return
      restaurant = Restaurant.where(:name => /cunningham/i).first
    end
    # THIS IS FUCKING UGLY. THERE HAS TO BE A BETTER WAY.
    respond_with ({:menu => restaurant.section.as_json(:include => {
                                                           # :subsection => { :include => {
                                                                                :dish => { :include => 
                                                                                               {
                                                                                                  :options => { :include => {
                                                                                                                   :individual_option => { :include => :icon }
                                                                                                                 }
                                                                                                               },
                                                                                                  :image => {:only => [:_id,:local_file,:rejected]}
                                                                                                 }
                                                                                           }
                                                                              # }
                                                                            # }
                                                         }
                                                       )
                   })
  end

  # def menu
  #   if params[:id].empty?
  #     render :text => {}.to_json
  #     return
  #   end
  #   restaurant = Restaurant.find(params[:id])
  #   if restaurant.nil? or restaurant.menu.nil?
  #     render :text => {}.to_json
  #     return
  #   end
  #   section_position = 0
  #   menu = restaurant.menu.first["sections"].collect.with_index do |section,top_index|
  #     if top_index == 0 and section["section_name"].blank?
  #       section["section_name"] = "Main"
  #     end
  #     section_position += 1
  #     next {
  #       :name => (section["section_name"].empty? ? "-" : section["section_name"]),
  #       :index => section_position,
  #       :id => (unique_id restaurant),
  #       :subsections => section["subsections"].collect.with_index do |subsection,sub_index|
  #         section_position += 1
  #         next {
  #           :name => subsection["subsection_name"],
  #           :index => section_position,
  #           :id => (unique_id restaurant),
  #           :dishes => subsection["contents"].collect.with_index do |dish,index|
  #             m = {
  #               :name => dish["name"].to_s.gsub(/\(.*?\)/,''),
  #               :index => index,
  #               :price => dish["price"].to_f.round(2),
  #               :id => (unique_id restaurant),
  #               :description => dish["description"],
  #               :options => dish["option_groups"].to_a.collect do |option|
  #                 {
  #                   :name => option["text"],
  #                   :id => (unique_id restaurant),
  #                   :type => option["type"],
  #                   :options => option["options"].collect do |op|
  #                     {
  #                       :name => op["name"],
  #                       :id => (unique_id restaurant),
  #                       :price => op["price"].to_f.round(2),
  #                     }
  #                   end
  #                 }
  #               end
  #             }
  #             m[:options] <<  {
  #                               name: "Toppings",
  #                               id: (unique_id restaurant),
  #                               type: "OPTION_ADD",
  #                               options: [
  #                                 {
  #                                 name: "Green Peppers",
  #                                 id: (unique_id restaurant),
  #                                 price: 0
  #                                 },
  #                                 {
  #                                 name: "Mushrooms",
  #                                 id: (unique_id restaurant),
  #                                 price: 1.5
  #                                 },
  #                                 {
  #                                 name: "Purple Things",
  #                                 id: (unique_id restaurant),
  #                                 price: 4.4
  #                                 },
  #                                 {
  #                                 name: "Gold",
  #                                 id: (unique_id restaurant),
  #                                 price: 22
  #                                 }
  #                               ]
  #                             }

  #             m[:options] <<  {
  #                               name: "SIZES",
  #                               id: (unique_id restaurant),
  #                               type: "OPTION_SELECT_ONE",
  #                               options: [
  #                                 {
  #                                 name: "Green Peppers",
  #                                 id: (unique_id restaurant),
  #                                 price: 0
  #                                 },
  #                                 {
  #                                 name: "Mushrooms",
  #                                 id: (unique_id restaurant),
  #                                 price: 1.5
  #                                 },
  #                                 {
  #                                 name: "Purple Things",
  #                                 id: (unique_id restaurant),
  #                                 price: 4.4
  #                                 },
  #                                 {
  #                                 name: "Gold",
  #                                 id: (unique_id restaurant),
  #                                 price: 22
  #                                 }
  #                               ]
  #                             }

  #             m[:options] <<  {
  #                               name: "Blaaa",
  #                               id: (unique_id restaurant),
  #                               type: "OPTION_SELECT_ONE",
  #                               options: [
  #                                 {
  #                                 name: "Green Peppers",
  #                                 id: (unique_id restaurant),
  #                                 price: 0
  #                                 },
  #                                 {
  #                                 name: "Mushrooms",
  #                                 id: (unique_id restaurant),
  #                                 price: 1.5
  #                                 },
  #                                 {
  #                                 name: "Purple Things",
  #                                 id: (unique_id restaurant),
  #                                 price: 4.4
  #                                 },
  #                               ]
  #                             }

  #             next m
  #           end
  #         }
  #       end,
  #     }
  #   end
  #   render :text => {:menu => menu}.to_json
  # end

end