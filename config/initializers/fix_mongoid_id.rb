module BSON
  class ObjectId   
    def to_json
      self.to_s.to_json
    end
    def as_json(options = {})
      self.to_s.as_json
    end     
  end
end