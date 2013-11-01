class Api::V1::RestaurantsController < ApplicationController
  respond_to :json
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

  def index

    sources = Rails.cache.fetch("restaurants", expires_in: 1.day) do
      (Restaurant.new.by_loc [45.458972,-74.155815]).to_a
    end

    sources = sources.collect do |c|
      # Rails.logger.warn c.images.to_json
      next {
        :id => c["_id"],
        :name => c.name,
        :lat => c.lat,
        :lon => c.lon,
        :images => c.images.reject{|e| e.nil?}.collect{|f| {:url => f["local_url"], :id => f["_id"]}}
      }
    end
    Rails.logger.warn "Outputted #{sources.size} items."
    respond_with sources
  end

  def unique_id restaurant
    @count ||= 0
    @count += 1
    return restaurant.id.to_s + @count.to_s
  end

  def menu
    if params[:id].empty?
      render :text => {}.to_json 
      return
    end
    restaurant = Restaurant.find(params[:id])
    if restaurant.nil? or restaurant.menu.nil?
      render :text => {}.to_json
      return
    end
    menu = restaurant.menu.first["sections"].collect do |section|
      {
        :name => section["section_name"],
        :id => (unique_id restaurant),
        :subsections => section["subsections"].collect do |subsection|
          {
            :name => subsection["subsection_name"],
            :id => (unique_id restaurant),
            :dishes => subsection["contents"].collect do |dish|
              {
                :name => dish["name"],
                :id => (unique_id restaurant),
                :description => dish["description"],
                :options => dish["option_groups"].to_a.collect do |option|
                  {
                    :name => option["text"],
                    :id => (unique_id restaurant),
                    :options => option["options"].collect do |op|
                      {
                        :name => op["name"],
                        :id => (unique_id restaurant),
                        :price => op["price"].to_f.round(2),
                      }
                    end
                  }
                end
              }
            end
          }
        end,
      }
    end
    render :text => menu.to_json
  end

end
