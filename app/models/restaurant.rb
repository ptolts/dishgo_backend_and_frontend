#encoding: utf-8

class Restaurant
  include Mongoid::Document
  store_in collection: "restaurants", database: "dishgo"
  field :lat, type: Float
  field :lon, type: Float
  field :subdomain, type: String
  field :locs, type: Array
  field :menu, type: Hash
  # field :images, type: Array
  field :name, type: String
  has_many :sources, :class_name => "Sources"
  has_many :image, :class_name => "Image"
  has_many :section, :class_name => "Section"
  has_many :orders, :class_name => "Order"
  belongs_to :user, :class_name => "User", index: true, inverse_of: :owns_restaurants

  accepts_nested_attributes_for :image, :allow_destroy => false

  index({ name: 1 }, { name: "name_index" })
  index({ _id:1 }, { unique: true, name:"id_index" })
  index({ locs: "2dsphere" }, { name:"location_index"})

  def by_loc loc=nil
    if loc
      cords = [loc[1],loc[0]]
    else
      cords = [-74.155815,45.458972]
    end
	 (Restaurant.includes(:sources).where(:locs => { "$near" => { "$geometry" => { "type" => "Point", :coordinates => cords }, "$maxDistance" => 10000}}).to_a + Restaurant.includes(:sources).where(:name => /moish/i).to_a)
  end

  def phone
    ph = self.sources.find do |e|
      !e.phone.blank?
    end
    if ph
      return ph.phone
    end
    return nil
  end

  def address
    ph = self.sources.find do |e|
      !e.address.blank?
    end
    if ph
      return ph.address
    end
    return nil
  end

  def dish_images
    resto = Restaurant.where(:name=>/cun/i).first
    images = resto.image.reject{|e| e.rejected}
    sections = resto.section
    sub = sections.collect{|r| r.subsection}.flatten
    dishes = sub.collect{|r| r.dish}.flatten
    dishes.each_with_index do |x,i|
      x.image = []
      if Random.rand(2) == 1
        num = Random.rand(images.size)
        # puts "making image [#{num}] -> #{images[num].local_file}"
        x.image << images[num]
      else
        # puts "no image"
      end
      x.save(:validate=>false)      
    end
    nil    
  end

  def menu_to_json
    # self.section.as_json(:include => {
    #                                                            # :subsection => { :include => {
    #                                                                                 :dishes => { :include => 
    #                                                                                                {
    #                                                                                                   :options => { :include => {
    #                                                                                                                    :individual_options => { :include => :icon }
    #                                                                                                                  }
    #                                                                                                                },
    #                                                                                                   :image => {},
    #                                                                                                   :sizes => { :include => {
    #                                                                                                                    :individual_options => { :include => :icon }
    #                                                                                                                  }
    #                                                                                                                },                                                                                                  
    #                                                                                                  }
    #                                                                                            }
    #                                                                               # }
    #                                                                             # }
    #                                                          })
     

    # result = RubyProf.profile {
      menu = self.section.collect do |section|
        hash = section.as_document
        hash["dishes"] = section.dishes.collect do |dish|
          dish_hash = dish.as_document
          dish_hash["sizes"] = dish.sizes.custom_to_hash if dish.sizes
          dish_hash["options"] = dish.options.collect do |option|
            next option.custom_to_hash
          end
          dish_hash["image"] = dish.image.collect do |image|
            img_hash = image.custom_to_hash
            next img_hash
          end
          next dish_hash
        end
        next hash
      end
    # }

    # open("callgrind.profile", "w") do |f|
    #   RubyProf::CallTreePrinter.new(result).print(f, :min_percent => 1)
    # end

    return Oj.dump(menu)
  end

end



