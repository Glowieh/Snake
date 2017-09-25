using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Snake.Models
{
    public class User
    {
        public int ID { get; set; }

        [RegularExpression(@"^[a-zA-Z''-'\s]*$")]
        [StringLength(32)]
        [Required]
        public string Name { get; set; }

        [StringLength(32)]
        [Required]
        public string Password { get; set; }

        public ICollection<Score> Scores { get; set; }
    }
}
