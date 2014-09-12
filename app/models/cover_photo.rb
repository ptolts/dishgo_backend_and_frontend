#encoding: UTF-8

class CoverPhoto
  include Mongoid::Document
  include Mongoid::Paperclip
  include Mongoid::Timestamps
  # extend Mongoid::PaperclipQueue

  store_in collection: "cover_photo", database: "dishgo"

  field :original_url, type: String
  field :position, type: Integer
  field :img_url_medium, type: String
  field :img_url_original, type: String
  field :height, type: Integer
  field :width, type: Integer  

  belongs_to :restaurant, class_name: "Restaurant", inverse_of: :cover_photos, index: true
  index({ _id:1 }, { unique: true, name:"id_index" })

  has_mongoid_attached_file :img, {
      :path           => ':hash_:style.png',
      :hash_secret => "we_like_food",
      :styles => {
        :original => { res_ize: '1920x999999999>' },
        :medium   => { res_ize: '420x999999999>' },
      },
      :processors => [:converter, :compressor],      
      storage: :fog,
      fog_credentials: {
        provider: 'Rackspace',
        rackspace_username: 'ptolts',
        rackspace_api_key: 'e9ba2a6e93591ce985a47ffada9d02d5',
        rackspace_region: :iad,
        persistent: false
      },
      fog_directory: 'cover_photos',
      fog_public: true,
    }

  field :img_fingerprint, type: String
  field :manual_img_fingerprint, type: String
  validates_attachment_content_type :img, :content_type => %w(image/jpeg image/jpg image/png), :message => 'file type is not allowed (only jpeg/png/gif images)'    
  after_post_process :img_post_process
  before_post_process :fuck_you_paperclip

  default_scope -> {desc(:created_at)}

  def self.set_default_scope opts
    self.default_scoping = nil
    eval("default_scope -> #{opts}")
  end

  def fuck_you_paperclip
    if @background_process
      return true
    else
      return false
    end
  end

  def do_background_work
    @background_process = true
    img.reprocess!
  end

  def img_url_medium
    return super.to_s.gsub(/http:\/\//,'https://').gsub(/\.r.{2}\./,'.ssl.')
  end

  def img_url_original
    return super.to_s.gsub(/http:\/\//,'https://').gsub(/\.r.{2}\./,'.ssl.')
  end

  def custom_to_hash
    return {_id: _id, id: _id, local_file: self.img_url_medium, medium: self.img_url_medium, rejected: false, original: self.img_url_original}
  end

  def serializable_hash options
    options ||= {}    
    start = super {}
    start[:id] = self._id
    start[:_id] = self._id
    start[:medium] = self.img_url_medium
    start[:original] = self.img_url_original
    start
  end  

  def img_post_process
    self.img_url_medium = img.url(:medium) 
    self.img_url_original = img.url(:original) 
    tempfile = img.queued_for_write[:original]
    unless tempfile.nil?
      geometry = Paperclip::Geometry.from_file(tempfile)
      self.manual_img_fingerprint = Digest::MD5.hexdigest(File.open(tempfile.path).read)
      self.width = geometry.width.to_i
      self.height = geometry.height.to_i
      self.img_file_size = tempfile.size
    end
  end

end



