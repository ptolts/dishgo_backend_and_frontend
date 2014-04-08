class Font
  include Mongoid::Document
  include Mongoid::Timestamps
  store_in collection: "font", database: "dishgo"

  field :name, type: String
  field :template_location, type: String
  field :css, type: String
  field :link, type: String

  has_many :restaurant

  index({ _id:1 }, { unique: true, name:"id_index" })


  def template_font_css
    return "" if self.template_location.blank?
    return "" if !File.exists?(self.template_location)
    File.read("#{self.template_location}/font.css")
  end

  def template_font_link
    return "" if self.template_location.blank?    
    return "" if !File.exists?(self.template_location)
    File.read("#{self.template_location}/link.txt")
  end 

  def serializable_hash options
    hash = super {}
    if !self.template_location.blank?
      hash[:css] = self.template_font_css
    end
    return hash
  end

end
