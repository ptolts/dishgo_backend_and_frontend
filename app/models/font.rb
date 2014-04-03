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
    File.read("#{self.template_location}/font.css")
  end

  def template_font_link
    File.read("#{self.template_location}/link.txt")
  end    
end
